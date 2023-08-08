import pMemoize from 'p-memoize'
import ExpiryMap from 'expiry-map'
import { getFile, listFiles } from './sftp-utils'
import pLimit from 'p-limit'
import { generateZip } from './zip-utils'

export const memListFiles = pMemoize(listFiles, {
  cache: new ExpiryMap(60_000 * 1),
})

export const memGetFile = pMemoize(getFile, {
  cache: new ExpiryMap(60_000 * 60),
})

export async function generateModpack() {
  const fileInfos = await memListFiles()
  console.debug('fetched info for %s files', fileInfos.length)

  const limit = pLimit(3)
  const dlPromises = fileInfos.map((file) => {
    return limit(() => memGetFile(file.name))
  })
  const results = await Promise.all(dlPromises)
  console.debug('download complete')

  const zip = await generateZip(
    results.map((buffer, index) => {
      return {
        buffer,
        filename: fileInfos[index].name,
      }
    })
  )
  console.debug('zip complete')

  return zip
}
