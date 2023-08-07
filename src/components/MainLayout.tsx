'use client'

import { ReactNode } from 'react'
import { Layout, Typography } from 'antd'

export default function MainLayout(props: { children: ReactNode }) {
  return (
    <Layout className="w-screen h-screen">
      <Layout.Header className="flex flex-row items-center">
        <h1 className="text-3xl text-white">CSA ForgeMC</h1>
      </Layout.Header>
      <Layout.Content>{props.children}</Layout.Content>
    </Layout>
  )
}
