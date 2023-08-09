import {
  checkIfBundleExists,
  createBundle,
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
  if (!(await checkIfBundleExists(timestamp))) {
    return NextResponse.json(
      {
        name: 'Bundle not found',
      },
      {
        status: 404,
      }
    )
  }

  return new NextResponse(await memGetBundle(timestamp), {
    headers: {
      'Content-Disposition': `attachment; filename="${timestamp}.zip"`,
    },
  })
}

const memCreateBundle = pMemoize(createBundle, {
  cache: new ExpiryMap(1000 * 60 * 30),
})

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

  memCreateBundle(timestamp)

  return NextResponse.json({
    status: 'QUEUED',
  })
}
