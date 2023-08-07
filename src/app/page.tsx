import { FileInfo, listFiles } from '@/utils/sftp-utils'

function Row({ name, size }: FileInfo) {
  return (
    <tr>
      <td>{name}</td>
      <td>{size / 1000 / 1000} MB</td>
    </tr>
  )
}

export default async function Home() {
  const files = await listFiles()

  return (
    <main>
      <table>
        <tr>
          <th>Name</th>
          <th>Size</th>
        </tr>
        {files?.map((file, index) => <Row {...file} key={index} />)}
      </table>
    </main>
  )
}
