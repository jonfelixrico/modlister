'use client'

import type { FileInfo } from '@/utils/sftp-utils'
import { Table } from 'antd'
import { ColumnsType } from 'antd/es/table'
import { round } from 'lodash'

const COLUMNS: ColumnsType<FileInfo> = [
  {
    title: 'File',
    key: 'name',
    dataIndex: 'name',
    render: (_, { name }) => {
      return (
        <a href={`mods/${name}`} download>
          {name}
        </a>
      )
    },
  },
  {
    title: 'Size',
    key: 'size',
    dataIndex: 'size',
    render: (_, { size }) => {
      return <div>{round(size / 1000 / 1000, 2)} MB</div>
    },
  },
]

const getKey = (file: FileInfo) => file.name

export default function FileTable(props: { files: FileInfo[] }) {
  return (
    <Table
      dataSource={props.files}
      columns={COLUMNS}
      pagination={false}
      rowKey={getKey}
    />
  )
}
