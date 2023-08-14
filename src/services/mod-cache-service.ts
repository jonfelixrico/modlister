import { readFile, rm, writeFile } from '@/utils/fs-utils'
import { glob } from 'glob'
import pLimit from 'p-limit'
import path from 'path'

export const MODS_DIR = path.join(process.cwd(), 'mods')

export async function getFilenames() {
  return (await glob('mods/*.jar')).map((globPath) => path.basename(globPath))
}

function getPath(filename: string) {
  return path.join(MODS_DIR, filename)
}

export async function deleteFromCache(filenames: string[]) {
  for (const filename of filenames) {
    console.debug('deleting %s...', filename)
    await rm(getPath(filename))
    console.log('deleted %s', filename)
  }
}

interface FileData {
  filename: string
  data: Buffer
}

export async function saveToCache(files: FileData[]) {
  for (const { filename, data } of files) {
    console.debug('saving %s...')
    await writeFile(filename, data)
    console.debug('saved %s'), filename
  }
}

export async function getFiles(): Promise<FileData[]> {
  const filenames = await getFilenames()

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
