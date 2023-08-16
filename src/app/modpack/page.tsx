import { Button } from 'antd'
import ModpackSplash from './ModpackSplash'
import pMemoize from 'p-memoize'
import ExpiryMap from 'expiry-map'
import { getLastModified } from '@/utils/sftp-utils'
import { checkIfArchiveExists, createArchive } from '@/services/archive-service'
import { syncMods } from '@/services/mod-manager-service'
import { getModCacheContents } from '@/services/mod-cache-service'
import { getAuxModLastModified } from '@/services/aux-mod-service'

// Tells Next.js that this page is for SSR
export const dynamic = 'force-dynamic'

function DownloadBtn(props: { timestamp: number }) {
  return <Button href={`bundle/${props.timestamp}`}>Download Bundle</Button>
}

async function prepareBundle(timestamp: string) {
  await syncMods()
  const mods = await getModCacheContents()
  await createArchive(timestamp, mods)
}
const memPrepareBundle = pMemoize(prepareBundle, {
  cache: new ExpiryMap(1000 * 60 * 30),
})

export default async function ModpackPage() {
  const lastModDt = Math.max(
    await getLastModified(),
    await getAuxModLastModified()
  )
  const bundleExists = await checkIfArchiveExists(lastModDt)

  if (!bundleExists) {
    // intended to be done asynchronously
    memPrepareBundle(String(lastModDt))
  }

  return (
    <div className="h-full w-full flex flex-col justify-center items-center">
      {bundleExists ? (
        <DownloadBtn timestamp={lastModDt} />
      ) : (
        <ModpackSplash timestamp={lastModDt} />
      )}
    </div>
  )
}
