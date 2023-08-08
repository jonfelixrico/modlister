import pMemoize from 'p-memoize'
import ExpiryMap from 'expiry-map'
import { getFile, listFiles } from '@/utils/sftp-utils'

export const memListFiles = pMemoize(listFiles, {
  cache: new ExpiryMap(60_000 * 1),
})

export const memGetFile = pMemoize(getFile, {
  cache: new ExpiryMap(60_000 * 60),
})
