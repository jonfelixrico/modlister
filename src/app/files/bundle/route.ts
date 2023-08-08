import { getFile, listFiles } from '@/utils/sftp-utils'
import { generateZip } from '@/utils/zip-utils'
import ExpiryMap from 'expiry-map'
import { NextResponse } from 'next/server'
import pLimit from 'p-limit'
import pMemoize from 'p-memoize'

async function generateBundle() {
  const fileInfos = await listFiles()

  const limit = pLimit(3)
  const dlPromises = fileInfos.map((file) => {
    return limit(() => getFile(file.name))
  })
  const results = await Promise.all(dlPromises)

  return await generateZip(
    results.map((buffer, index) => {
      return {
        buffer,
        filename: fileInfos[index].name,
      }
    })
  )
}

const memGenerateBundle = pMemoize((_: string) => generateBundle(), {
  cache: new ExpiryMap(60_000 * 10),
})

export async function GET(req: Request) {
  const url = new URL(req.url)

  const fileBuffer = await memGenerateBundle(
    url.searchParams.get('lastModified') ?? 'unknown'
  )

  return new NextResponse(fileBuffer)
}
