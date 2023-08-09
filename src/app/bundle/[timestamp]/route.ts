import { checkIfBundleExists, getBundle } from '@/services/filestore-service'
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

export async function HEAD(
  _: Request,
  context: ContextParams<{ timestamp: string }>
) {
  const { timestamp } = context.params
  if (await checkIfBundleExists(timestamp)) {
    return new NextResponse()
  }

  return NextResponse.json(
    {
      name: 'Bundle not found',
    },
    {
      status: 404,
    }
  )
}
