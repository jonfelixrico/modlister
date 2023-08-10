import Client from 'ssh2-sftp-client'
import { getValue } from './config-utils'

async function getClient() {
  const host = await getValue('sftpUsername')
  const port = await getValue('sftpPasword')
  const username = await getValue('sftpUsername')
  const password = await getValue('sftpPassword')

  if (
    typeof host === 'undefined' ||
    typeof port === 'undefined' ||
    typeof password === 'undefined' ||
    typeof username === 'undefined'
  ) {
    throw new Error('bad config')
  }

  const client = new Client()
  await client.connect({
    host,
    port: parseInt(port),
    username,
    password,
  })
  return client
}

export async function sftpExecute<T>(
  toExec: (client: Client) => Promise<T> | T
): Promise<T> {
  let client: Client | null = null

  try {
    client = await getClient()
    return await toExec(client)
  } finally {
    if (client) {
      client.end()
    }
  }
}

export type FileInfo = Client.FileInfo
export async function listFiles(): Promise<FileInfo[]> {
  return await sftpExecute(async (client) => await client.list('./mods'))
}

export class FileNotFoundError extends Error {}

export async function getFile(filename: string): Promise<Buffer> {
  const path = `./mods/${filename}`

  return await sftpExecute(async (client) => {
    if (!(await client.exists(path))) {
      throw new FileNotFoundError()
    }

    return (await client.get(path)) as Buffer
  })
}

export async function getLastModified(): Promise<number> {
  return await sftpExecute(async (client) => {
    const stat = await client.stat('./mods')
    return stat.modifyTime
  })
}
