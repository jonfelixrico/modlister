import path from 'path'
import { glob } from 'glob'
import { intersection } from 'lodash'
import { listFiles, sftpExecute } from '@/utils/sftp-utils'

export const FILESTORE_DIR = path.join(process.cwd(), 'filestore')

async function getStoredFiles() {
  return await glob('mods/*.jar')
}

async function getMissingFilenames(reference: string[]): Promise<string[]> {
  const stored = await getStoredFiles()
  const common = new Set(intersection(reference, stored))
  return reference.filter((str) => common.has(str))
}

export async function executeSync() {
  await sftpExecute(async (client) => {
    const modlistFiles = await client.list('./mods')

    const missingFilenames = await getMissingFilenames(
      modlistFiles.map((file) => file.name)
    )

    for (const filename of missingFilenames) {
      await client.fastGet(
        `./mods/${filename}`,
        path.join(FILESTORE_DIR, filename)
      )
    }
  })
}

export async function isSynced() {
  const modlistFiles = await listFiles()
  const missing = await getMissingFilenames(
    modlistFiles.map((file) => file.name)
  )
  return !missing.length
}
