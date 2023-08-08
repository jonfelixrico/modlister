import { ContextParams } from '@/types/ContextParams.type'
import { FileNotFoundError, getFile } from '@/utils/sftp-utils'
import ExpiryMap from 'expiry-map'
import { NextResponse } from 'next/server'
import pMemoize from 'p-memoize'

const cache = new ExpiryMap(60_000 * 5)
const memGetFile = pMemoize(getFile, { cache })

export async function GET(
  _: Request,
  { params: { filename } }: ContextParams<{ filename: string }>
) {
  try {
    const fileBuffer = await memGetFile(filename)
    return new NextResponse(fileBuffer)
  } catch (e) {
    if (e instanceof FileNotFoundError) {
      return NextResponse.json(
        {
          error: `${filename} was not found in the modlist`,
        },
        {
          status: 404,
        }
      )
    }
  }
}
