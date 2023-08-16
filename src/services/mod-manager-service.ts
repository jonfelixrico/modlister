import { intersection } from 'lodash'
import { sftpExecute } from '@/utils/sftp-utils'

import {
  deleteFromModCache,
  getModCacheFilenames,
  saveToModCache,
} from './mod-cache-service'
import Client from 'ssh2-sftp-client'
import { File } from '@/types/File.interface'
import pLimit from 'p-limit'

async function fetchFile(client: Client, filename: string): Promise<File> {
  console.debug('fetching %s...', filename)
  const data = (await client.get(`./mods/${filename}`)) as Buffer
  console.log('fetched %s', filename)

  return {
    data,
    filename,
  }
}

export async function syncMods() {
  await sftpExecute(async (client) => {
    const inSource = (await client.list('./mods')).map((file) => file.name)
    const inCache = await getModCacheFilenames()

    const common = new Set(intersection(inSource, inCache))

    const concurrentFetchLimiter = pLimit(3)
    const missingFilenames = inSource.filter((str) => !common.has(str))
    const fetchedFilesPromises = missingFilenames.map((filename) => {
      return concurrentFetchLimiter(() => fetchFile(client, filename))
    })
    const fetchedFiles = await Promise.all(fetchedFilesPromises)
    await saveToModCache(fetchedFiles)

    const extraFilenames = inCache.filter((str) => !common.has(str))
    await deleteFromModCache(extraFilenames)
  })
}
