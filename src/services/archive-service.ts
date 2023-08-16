import { File } from '@/types/File.interface'
import { readFile, writeFile } from '@/utils/fs-utils'
import { archiveFilesAsBuffer } from '@/utils/zip-utils'
import { glob } from 'glob'
import path from 'path'

const DIR = 'files/archives'
const ARCHIVE_PATH = path.join(process.cwd(), DIR)

export async function createArchive(archiveFilename: string, files: File[]) {
  const buffer = await archiveFilesAsBuffer(
    files.map((file) => {
      return {
        filename: file.filename,
        buffer: file.data, // TODO change archiveFilesAsBuffer to use the File interface
      }
    })
  )

  const filename = `${archiveFilename}.zip`
  console.debug('archiving mods into %s', filename)
  await writeFile(path.join(ARCHIVE_PATH, filename), buffer)
  console.log('created archive %s', filename)
}

export async function getBundle(filename: string) {
  return await readFile(path.join(ARCHIVE_PATH, filename))
}

export async function checkIfArchiveExists(
  timestamp: number | string
): Promise<boolean> {
  const results = await glob(path.join(DIR, `${timestamp}.zip`))
  return results.length > 0
}
