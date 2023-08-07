import { listFiles } from '@/utils/sftp-utils'
import { GetServerSideProps } from 'next'

export default function Home({
  files,
}: {
  files: Awaited<ReturnType<typeof listFiles>>
}) {
  return (
    <main>
      {files?.map((file, index) => (
        <div key={index}>{JSON.stringify(file)}</div>
      ))}
    </main>
  )
}

export const getServerSideProps: GetServerSideProps<{
  files: Awaited<ReturnType<typeof listFiles>>
}> = async () => {
  const files = await listFiles()
  return {
    props: {
      files,
    },
  }
}
