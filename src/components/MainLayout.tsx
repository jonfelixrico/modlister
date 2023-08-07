'use client'

import { ReactNode } from 'react'
import { Layout } from 'antd'

export default function MainLayout(props: { children: ReactNode }) {
  return (
    <Layout className="w-screen h-screen">
      <Layout.Header>CSA ForgeMC</Layout.Header>
      <Layout.Content>{props.children}</Layout.Content>
    </Layout>
  )
}
