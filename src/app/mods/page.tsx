import { FileInfo, listFiles } from '@/utils/sftp-utils'
import { round } from 'lodash'

function Row({ name, size }: Pick<FileInfo, 'name' | 'size'>) {
  return (
    <tr>
      <td>
        <a href={`/mods/${name}`} download>
          {name}
        </a>
      </td>
      <td>{round(size / 1000 / 1000, 2)} MB</td>
    </tr>
  )
}

export default async function Mods() {
  const files = await listFiles()

  return (
    <div className="h-full w-full overflow-auto p-6">
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Size</th>
          </tr>
        </thead>

        <tbody>
          {files.map(({ name, size }, index) => (
            <Row name={name} size={size} key={index} />
          ))}
        </tbody>
      </table>
    </div>
  )
}
