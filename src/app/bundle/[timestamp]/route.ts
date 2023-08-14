import { ContextParams } from '@/types/ContextParams.type'
import ExpiryMap from 'expiry-map'
import { NextResponse } from 'next/server'
import pMemoize from 'p-memoize'
import moment from 'moment'
import { checkIfBundleExists, getBundle } from '@/services/archive-service'

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

  const asDate = new Date(parseInt(timestamp))
  const formatted = moment(asDate).format('YYYY-MM-DD HH-mm')
  return new NextResponse(await memGetBundle(timestamp), {
    headers: {
      'Content-Disposition': `attachment; filename="modpack ${formatted}.zip"`,
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
