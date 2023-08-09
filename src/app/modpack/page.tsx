import { checkIfBundleExists } from '@/services/filestore-service'
import { memListFiles } from '@/utils/mod-utils'
import { Button } from 'antd'
import ModpackSplash from './ModpackSplash'

async function getLastModDt() {
  const files = await memListFiles()
  return Math.max(...files.map(({ modifyTime }) => modifyTime))
}

function DownloadBtn(props: { timestamp: number }) {
  return <Button href={`bundle/${props.timestamp}`}>Download Bundle</Button>
}

export default async function ModpackPage() {
  const lastModDt = await getLastModDt()
  const bundleExists = await checkIfBundleExists(lastModDt)

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
