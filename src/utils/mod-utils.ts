import pMemoize from 'p-memoize'
import ExpiryMap from 'expiry-map'
import { getFile, listFiles } from './sftp-utils'

export const memListFiles = pMemoize(listFiles, {
  cache: new ExpiryMap(1000 * 60),
})

export const memGetFile = pMemoize(getFile, {
  cache: new ExpiryMap(1000 * 60 * 60),
})
