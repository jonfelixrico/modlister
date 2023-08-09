import path from 'path'
import { glob } from 'glob'
import { intersection } from 'lodash'
import { listFiles, sftpExecute } from '@/utils/sftp-utils'
import Bluebird from 'bluebird'
import fs from 'graceful-fs'
import pLimit from 'p-limit'
import { archiveFilesAsBuffer } from '@/utils/zip-utils'

export const MODS_DIR = path.join(process.cwd(), 'mods')
export const BUNDLES_DIR = path.join(process.cwd(), 'bundles')

async function getStoredMods() {
  return (await glob('mods/*.jar')).map((globPath) => path.basename(globPath))
}

async function getMissingMods(reference: string[]): Promise<string[]> {
  const stored = await getStoredMods()
  const common = new Set(intersection(reference, stored))
  return reference.filter((str) => common.has(str))
}

export async function executeSync() {
  await sftpExecute(async (client) => {
    const modlistFiles = await client.list('./mods')

    const missingFilenames = await getMissingMods(
      modlistFiles.map((file) => file.name)
    )

    for (const filename of missingFilenames) {
      await client.fastGet(`./mods/${filename}`, path.join(MODS_DIR, filename))
    }
  })
}

export async function isSynced() {
  const modlistFiles = await listFiles()
  const missing = await getMissingMods(modlistFiles.map((file) => file.name))
  return !missing.length
}

const readFile = Bluebird.promisify(fs.readFile)
const writeFile = Bluebird.promisify(fs.writeFile)

export async function createZippedFilestore() {
  const filenames = await getStoredMods()

  const limited = pLimit(5)
  const buffers = await Promise.all(
    filenames.map((filename) => limited(() => readFile(filename)))
  )

  const buffer = await archiveFilesAsBuffer(
    buffers.map((buffer, index) => {
      return {
        filename: filenames[index],
        buffer,
      }
    })
  )

  await writeFile(path.join(BUNDLES_DIR, `${Date.now()}.zip`), buffer)

  return buffer
}
