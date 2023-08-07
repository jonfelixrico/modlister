import { ContextParams } from '@/types/ContextParams.type'
import { getFile } from '@/utils/sftp-utils'
import { NextResponse } from 'next/server'

export async function GET(
  _: Request,
  context: ContextParams<{ filename: string }>
) {
  const fileBuffer = await getFile(context.params.filename)
  return new NextResponse(fileBuffer)
}
