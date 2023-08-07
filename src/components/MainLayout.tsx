'use client'

import { ReactNode } from 'react'
import { Layout } from 'antd'

export default function MainLayout(props: { children: ReactNode }) {
  return (
    <Layout>
      <Layout.Header>test</Layout.Header>
      <Layout.Content>{props.children}</Layout.Content>
    </Layout>
  )
}
