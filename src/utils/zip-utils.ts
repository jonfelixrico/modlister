import archiver from 'archiver'
import MemoryStream from 'memorystream'
import { getStreamAsBuffer } from 'get-stream'
import { File } from '@/types/File.interface'

function generateZipToStream<T extends NodeJS.WritableStream>(
  files: File[],
  stream: T
): Promise<T> {
  return new Promise((resolve, reject) => {
    const archive = archiver('zip')

    stream.on('finish', () => {
      try {
        resolve(stream)
      } catch (e) {
        reject(e)
      }
    })
    archive.on('error', (err) => {
      reject(err)
      stream.end()
    })
    archive.on('warning', (err) => {
      if (err.code !== 'ENOENT') {
        reject(err)
        stream.end()
      }
    })

    archive.pipe(stream)
    for (const { data, filename } of files) {
      archive.append(data, { name: filename })
    }
    archive.finalize()
  })
}

export async function archiveFilesAsBuffer(files: File[]): Promise<Buffer> {
  const zipStream = await generateZipToStream(files, new MemoryStream())
  return await getStreamAsBuffer(zipStream)
}
