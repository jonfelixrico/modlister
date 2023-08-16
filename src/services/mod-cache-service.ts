import { File } from '@/types/File.interface'
import { readFile, rm, writeFile } from '@/utils/fs-utils'
import { glob } from 'glob'
import pLimit from 'p-limit'
import path from 'path'

const RELATIVE_DIR = 'files/mods'
const ABSOLUTE_DIR = path.join(process.cwd(), RELATIVE_DIR)

export async function getModCacheFilenames() {
  return (await glob(`${RELATIVE_DIR}/*.jar`)).map((globPath) =>
    path.basename(globPath)
  )
}

function getPath(filename: string) {
  return path.join(ABSOLUTE_DIR, filename)
}

export async function deleteFromModCache(filenames: string[]) {
  for (const filename of filenames) {
    console.debug('deleting %s...', filename)
    await rm(getPath(filename))
    console.log('deleted %s', filename)
  }
}

export async function saveToModCache(files: File[]) {
  for (const { filename, data } of files) {
    console.debug('saving %s...', filename)
    await writeFile(getPath(filename), data)
    console.debug('saved %s', filename)
  }
}

export async function getModCacheContents(): Promise<File[]> {
  const filenames = await getModCacheFilenames()

  const limited = pLimit(5)
  const buffers = await Promise.all(
    filenames.map((filename) => limited(() => readFile(getPath(filename))))
  )

  return buffers.map((buffer, index) => {
    return {
      data: buffer,
      filename: filenames[index],
    }
  })
}
