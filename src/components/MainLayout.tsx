'use client'

import { ReactNode } from 'react'
import { Layout, Typography } from 'antd'

export default function MainLayout(props: { children: ReactNode }) {
  return (
    <Layout className="w-screen h-screen">
      <Layout.Header>
        <Typography.Title className="mb-0">CSA ForgeMC</Typography.Title>
      </Layout.Header>
      <Layout.Content>{props.children}</Layout.Content>
    </Layout>
  )
}
