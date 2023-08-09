import { isSynced } from '@/services/filestore-service'
import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    synced: await isSynced(),
  })
}
