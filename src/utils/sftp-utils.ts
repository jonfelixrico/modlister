import Client from 'ssh2-sftp-client'

type SFTPWrapper = Awaited<ReturnType<Client['connect']>>

function getClient() {
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
  return client.connect({
    host,
    port: parseInt(port),
    username,
    password,
  })
}

async function executeInClient<T>(
  toExec: (client: SFTPWrapper) => Promise<T> | T
): Promise<T> {
  let client: SFTPWrapper | null = null

  try {
    client = await getClient()
    return await toExec(client)
  } finally {
    if (client) {
      client.end()
    }
  }
}
