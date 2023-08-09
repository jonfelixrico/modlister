import {
  checkIfBundleExists,
  createZippedFilestore,
  getBundle,
} from '@/services/filestore-service'
import { ContextParams } from '@/types/ContextParams.type'
import ExpiryMap from 'expiry-map'
import { NextResponse } from 'next/server'
import pMemoize from 'p-memoize'

const memGetBundle = pMemoize(getBundle, { cache: new ExpiryMap(1000 * 10) })

export async function GET(
  _: Request,
  context: ContextParams<{ timestamp: string }>
) {
  const { timestamp } = context.params
  return new NextResponse(await memGetBundle(timestamp))
}

export async function POST(
  _: Request,
  context: ContextParams<{ timestamp: string }>
) {
  const { timestamp } = context.params

  if (await checkIfBundleExists(timestamp)) {
    return NextResponse.json({
      status: 'DONE',
    })
  }

  // do async process

  return NextResponse.json({
    status: 'QUEUED',
  })
}
