import { memListFiles } from '@/utils/mod-utils'
import FileTable from './FileTable'

export const dynamic = 'force-dynamic'

export default async function Mods() {
  const files = await memListFiles()

  return (
    <div className="h-full w-full overflow-auto p-6">
      <FileTable files={files} />
    </div>
  )
}
