import { rm, writeFile } from '@/utils/fs-utils'
import { glob } from 'glob'
import path from 'path'

export const MODS_DIR = path.join(process.cwd(), 'mods')

export async function getCached() {
  return (await glob('mods/*.jar')).map((globPath) => path.basename(globPath))
}

function getPath(filename: string) {
  return path.join(MODS_DIR, filename)
}

export async function deleteFromCache(filenames: string[]) {
  for (const filename of filenames) {
    console.debug('deleting %s...', filename)
    await rm(getPath(filename))
    console.log('deleted %s', filename)
  }
}

interface ToAdd {
  filename: string
  data: Buffer
}

export async function saveToCache(files: ToAdd[]) {
  for (const { filename, data } of files) {
    console.debug('saving %s...')
    await writeFile(filename, data)
    console.debug('saved %s'), filename
  }
}
