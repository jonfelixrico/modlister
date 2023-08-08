import pMemoize from 'p-memoize'
import ExpiryMap from 'expiry-map'
import { listFiles } from '@/utils/sftp-utils'

export const memListFiles = pMemoize(listFiles, {
  cache: new ExpiryMap(60_000 * 1),
})
