import { ContextParams } from '@/types/ContextParams.type'

export async function GET(
  request: Request,
  context: ContextParams<{ filename: string }>
) {
  return null
}
