import {
  checkIfBundleExists,
  createBundle,
  executeSync,
} from '@/services/filestore-service'
import { memListFiles } from '@/utils/mod-utils'
import { Button } from 'antd'
import ModpackSplash from './ModpackSplash'
import pMemoize from 'p-memoize'
import ExpiryMap from 'expiry-map'

async function getLastModDt() {
  const files = await memListFiles()
  return Math.max(...files.map(({ modifyTime }) => modifyTime))
}

function DownloadBtn(props: { timestamp: number }) {
  return <Button href={`bundle/${props.timestamp}`}>Download Bundle</Button>
}

async function prepareBundle(timestamp: string) {
  await executeSync()
  await createBundle(timestamp)
}
const memPrepareBundle = pMemoize(prepareBundle, {
  cache: new ExpiryMap(1000 * 60 * 30),
})

export default async function ModpackPage() {
  const lastModDt = await getLastModDt()
  const bundleExists = await checkIfBundleExists(lastModDt)

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
