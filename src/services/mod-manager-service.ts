import { intersection } from 'lodash'
import { sftpExecute } from '@/utils/sftp-utils'

import {
  deleteFromModCache,
  getModCacheFilenames,
  saveToModCache,
} from './mod-cache-service'
import Client from 'ssh2-sftp-client'
import { File } from '@/types/File.interface'

async function getFile(client: Client, filename: string): Promise<File> {
  return {
    data: (await client.get(`./mods/${filename}`)) as Buffer,
    filename,
  }
}

export async function syncMods() {
  await sftpExecute(async (client) => {
    const inSource = (await client.list('./mods')).map((file) => file.name)
    const inCache = await getModCacheFilenames()

    const common = new Set(intersection(inSource, inCache))

    const missingFilenames = inSource.filter((str) => !common.has(str))
    const fetchedFilesPromises = missingFilenames.map((filename) =>
      getFile(client, filename)
    )
    const fetchedFiles = await Promise.all(fetchedFilesPromises)
    await saveToModCache(fetchedFiles)

    const extraFilenames = inCache.filter((str) => !common.has(str))
    await deleteFromModCache(extraFilenames)
  })
}
