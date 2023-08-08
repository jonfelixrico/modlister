import { generateModpack } from '@/utils/mod-utils'
import ExpiryMap from 'expiry-map'
import { NextResponse } from 'next/server'

import pMemoize from 'p-memoize'

const memGenerateBundle = pMemoize(generateModpack, {
  cache: new ExpiryMap(60_000),
})

export async function GET() {
  return new NextResponse(await memGenerateBundle())
}
