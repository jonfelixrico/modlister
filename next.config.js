/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // Without this, the code will break on runtime
    serverComponentsExternalPackages: ['ssh2-sftp-client'],
  },

  /*
   * Ref: https://github.com/vercel/next.js/tree/canary/examples/with-docker#in-existing-projects
   * This is necessary to support the use of Docker.
   */
  output: 'standalone',
}

module.exports = nextConfig
