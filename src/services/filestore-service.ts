import path from 'path'
import { glob } from 'glob'
import { intersection } from 'lodash'

export const FILESTORE_DIR = path.join(process.cwd(), 'filestore')

async function getStoredFiles() {
  return await glob('mods/*.jar')
}

async function getMissingFiles(reference: string[]): Promise<string[]> {
  const stored = await getStoredFiles()
  const common = new Set(intersection(reference, stored))
  return reference.filter((str) => common.has(str))
}
