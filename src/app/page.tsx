import { listFiles } from '@/utils/sftp-utils'

export default async function Home() {
  const files = await listFiles()
  return (
    <main>
      {files.map((file, index) => (
        <div key={index}>{JSON.stringify(file)}</div>
      ))}
    </main>
  )
}
