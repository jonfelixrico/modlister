import { listFiles } from '@/utils/sftp-utils'
import FileTable from './FileTable'
import pMemoize from 'p-memoize'
import ExpiryMap from 'expiry-map'

const memListFiles = pMemoize(listFiles, { cache: new ExpiryMap(60_000 * 1) })

export default async function Mods() {
  const files = await memListFiles()

  return (
    <div className="h-full w-full overflow-auto p-6">
      <FileTable files={files} />
    </div>
  )
}
