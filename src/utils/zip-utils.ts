import archiver from 'archiver'
import MemoryStream from 'memorystream'
import { getStreamAsBuffer } from 'get-stream'

export interface FileToArchive {
  filename: string
  buffer: Buffer
}

export function generateZip(files: FileToArchive[]): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const output = new MemoryStream()
    const archive = archiver('zip')

    output.on('finish', async () => {
      try {
        resolve(await getStreamAsBuffer(output))
      } catch (e) {
        reject(e)
      }
    })
    archive.on('error', (err) => {
      reject(err)
      output.end()
    })
    archive.on('warning', (err) => {
      if (err.code !== 'ENOENT') {
        reject(err)
        output.end()
      }
    })

    archive.pipe(output)
    for (const { buffer, filename } of files) {
      archive.append(buffer, { name: filename })
    }
    archive.finalize()
  })
}
