import pMemoize from 'p-memoize'
import ExpiryMap from 'expiry-map'
import { getFile, listFiles } from './sftp-utils'
import { archiveFilesAsBuffer } from './zip-utils'

export const memListFiles = pMemoize(listFiles, {
  cache: new ExpiryMap(60_000 * 1),
})

export const memGetFile = pMemoize(getFile, {
  cache: new ExpiryMap(60_000 * 60),
})

export async function generateModpack() {
  const fileInfos = await memListFiles()
  console.debug('fetched info for %s files', fileInfos.length)

  const downloaded: Buffer[] = []
  for (const { name } of fileInfos) {
    downloaded.push(await memGetFile(name))
    console.debug('acquired %s', name)
  }
  console.debug('download complete')

  const zip = await archiveFilesAsBuffer(
    downloaded.map((buffer, index) => {
      return {
        buffer,
        filename: fileInfos[index].name,
      }
    })
  )
  console.debug('zip complete')

  return zip
}
