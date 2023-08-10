import Bluebird from 'bluebird'
import fs from 'graceful-fs'
import { get } from 'lodash'
import path from 'path'

const ROOT_DIR = `config`
const FILE_SEQUENCE = ['config.default.json', './config.json']

function readJson(path: string): Promise<Record<string, unknown>> {
  return new Promise((resolve, reject) => {
    fs.readFile(
      path,
      {
        encoding: 'utf-8',
      },
      (err, data) => {
        if (err) {
          if (err.code === 'ENOENT') {
            return resolve({})
          } else {
            return reject(err)
          }
        }

        try {
          resolve(JSON.parse(data))
        } catch (e) {
          reject(e)
        }
      }
    )
  })
}

async function readConfigFiles(): Promise<Record<string, unknown>> {
  const obj: Record<string, unknown> = {}

  for (const filename of FILE_SEQUENCE) {
    const absPath = path.join(process.cwd(), ROOT_DIR, filename)

    try {
      Object.assign(obj, await readJson(absPath))
    } catch (e) {
      console.error('Error while reading file %s', absPath, e)
    }
  }

  return obj
}

let cached: Promise<Record<string, unknown>> | null = null
export function getConfig(): Promise<Record<string, unknown>> {
  if (cached) {
    return cached
  }

  let newPromise = readConfigFiles()
  cached = newPromise
  cached.catch(() => {
    if (cached === newPromise) {
      cached = null
    }
  })

  return newPromise
}

export async function getValue<T = string>(
  path: string
): Promise<T | undefined> {
  const valueInPath = get(await getConfig(), path, undefined)
  return valueInPath as T
}

export async function getValueOrThrow<T = string>(path: string): Promise<T> {
  const value = await getValue<T>(path)

  if (value === undefined) {
    throw new Error(`Path ${path} is undefined`)
  }

  return value
}
