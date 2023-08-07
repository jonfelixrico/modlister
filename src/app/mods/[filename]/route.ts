import { ContextParams } from '@/types/ContextParams.type'
import { getFile } from '@/utils/sftp-utils'

export async function GET(
  _: Request,
  context: ContextParams<{ filename: string }>
) {
  return await getFile(context.params.filename)
}
