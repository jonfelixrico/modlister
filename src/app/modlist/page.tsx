import { memListFiles } from '@/utils/mod-utils'
import FileTable from './FileTable'

// Tells Next.js that this page is for SSR
export const dynamic = 'force-dynamic'

export default async function Mods() {
  const files = await memListFiles()

  return (
    <div className="h-full w-full overflow-auto p-6">
      <FileTable files={files} />
    </div>
  )
}
