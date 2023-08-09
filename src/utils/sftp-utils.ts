import Client from 'ssh2-sftp-client'

async function getClient() {
  const host = process.env.SFTP_HOST
  const port = process.env.SFTP_PORT
  const username = process.env.SFTP_USERNAME
  const password = process.env.SFTP_PASSWORD

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
