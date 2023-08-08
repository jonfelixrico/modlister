import { getFile, listFiles } from '@/utils/sftp-utils'
import { generateZip } from '@/utils/zip-utils'
import ExpiryMap from 'expiry-map'
import { NextResponse } from 'next/server'
import pLimit from 'p-limit'
import pMemoize from 'p-memoize'

async function generateBundle() {
  const fileInfos = await listFiles()
  console.debug('fetched info for %s files', fileInfos.length)

  const limit = pLimit(3)
  const dlPromises = fileInfos.map((file) => {
    return limit(() => getFile(file.name))
  })
  const results = await Promise.all(dlPromises)
  console.debug('download complete')

  const zip = await generateZip(
    results.map((buffer, index) => {
      return {
        buffer,
        filename: fileInfos[index].name,
      }
    })
  )
  console.debug('zip complete')

  return zip
}

const memGenerateBundle = pMemoize((_: string) => generateBundle(), {
  cache: new ExpiryMap(60_000 * 10),
})

export async function GET(req: Request) {
  const url = new URL(req.url)

  console.log('started')
  const fileBuffer = await memGenerateBundle(
    url.searchParams.get('lastModified') ?? 'unknown'
  )
  console.log('ended')

  return new NextResponse(fileBuffer)
}
