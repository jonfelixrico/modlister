import { createZippedFilestore } from '@/services/filestore-service'
import { NextResponse } from 'next/server'

export async function GET(_: Request) {
  return new NextResponse(await createZippedFilestore())
}
