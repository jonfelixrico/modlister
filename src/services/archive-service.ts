import { File } from '@/types/File.interface'
import { readFile, writeFile } from '@/utils/fs-utils'
import { archiveFilesAsBuffer } from '@/utils/zip-utils'
import { glob } from 'glob'
import path from 'path'

const RELATIVE_DIR = 'files/archives'
const ABSOLUTE_DIR = path.join(process.cwd(), RELATIVE_DIR)

export async function createArchive(archiveFilename: string, files: File[]) {
  const buffer = await archiveFilesAsBuffer(files)

  const filename = `${archiveFilename}.zip`
  console.debug('archiving mods into %s', filename)
  await writeFile(path.join(ABSOLUTE_DIR, filename), buffer)
  console.log('created archive %s', filename)
}

export async function getArchive(filename: string) {
  return await readFile(path.join(ABSOLUTE_DIR, `${filename}.zip`))
}

export async function checkIfArchiveExists(
  timestamp: number | string
): Promise<boolean> {
  const results = await glob(`${RELATIVE_DIR}/${timestamp}.zip`)
  return results.length > 0
}
