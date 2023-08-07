import { ContextParams } from '@/types/ContextParams.type'
import { FileNotFoundError, getFile } from '@/utils/sftp-utils'
import { NextResponse } from 'next/server'

export async function GET(
  _: Request,
  { params: { filename } }: ContextParams<{ filename: string }>
) {
  try {
    const fileBuffer = await getFile(filename)
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
