import { File } from '@/types/File.interface'
import { readFile, stat } from '@/utils/fs-utils'
import { Stats } from 'fs'
import { glob } from 'glob'
import pLimit from 'p-limit'
import path from 'path'

const RELATIVE_DIR = 'files/aux-mods'
const ABSOLUTE_DIR = path.join(process.cwd(), RELATIVE_DIR)

export async function getAuxModFilenames() {
  return (await glob(`${RELATIVE_DIR}/*.jar`)).map((globPath) =>
    path.basename(globPath)
  )
}

export async function getAuxModContents(): Promise<File[]> {
  const filenames = await getAuxModFilenames()

  const limited = pLimit(5)
  const buffers = await Promise.all(
    filenames.map((filename) =>
      limited(() => readFile(path.join(ABSOLUTE_DIR, filename)))
    )
  )

  return buffers.map((buffer, index) => {
    return {
      data: buffer,
      filename: filenames[index],
    }
  })
}

export async function getAuxModLastModified(): Promise<number> {
  const { mtime } = (await stat(ABSOLUTE_DIR)) as Stats
  return mtime.getTime()
}
