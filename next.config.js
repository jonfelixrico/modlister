/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // Without this, the code will break on runtime
    serverComponentsExternalPackages: ['ssh2-sftp-client'],
  },
}

module.exports = nextConfig
