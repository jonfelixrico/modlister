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
  return reference.filter((str) => !common.has(str))
}

const rm = Bluebird.promisify(fs.rm)
export async function executeSync() {
  await sftpExecute(async (client) => {
    const inModlist = (await client.list('./mods')).map((file) => file.name)
    const inServer = await getStoredMods()

    const common = new Set(intersection(inModlist, inServer))

    const missing = inModlist.filter((str) => !common.has(str))
    for (const filename of missing) {
      console.debug('downloading %s', filename)
      await client.fastGet(`./mods/${filename}`, path.join(MODS_DIR, filename))
      console.log('downloaded %s', filename)
    }

    const extra = inServer.filter((str) => !common.has(str))
    for (const filename of extra) {
      console.debug('deleting %s', filename)
      await rm(path.join(MODS_DIR, filename))
      console.log('deleted %s', filename)
    }
  })
}

const readFile = Bluebird.promisify(fs.readFile)
const writeFile = Bluebird.promisify(fs.writeFile)

export async function createBundle(name: string) {
  const filenames = await getStoredMods()

  const limited = pLimit(5)
  const buffers = await Promise.all(
    filenames.map((filename) =>
      limited(() => readFile(path.join(MODS_DIR, filename)))
    )
  )

  const buffer = await archiveFilesAsBuffer(
    buffers.map((buffer, index) => {
      return {
        filename: filenames[index],
        buffer,
      }
    })
  )

  await writeFile(path.join(BUNDLES_DIR, `${name}.zip`), buffer)
}

export async function getBundle(timestamp: number | string) {
  return await readFile(path.join(BUNDLES_DIR, `${timestamp}.zip`))
}

export async function checkIfBundleExists(
  timestamp: number | string
): Promise<boolean> {
  const results = await glob(`bundles/${timestamp}.zip`)
  return results.length > 0
}
