'use client'

import { Button, Spin } from 'antd'
import { useState } from 'react'
import { useInterval } from 'react-use'

export default function ModpackSplash(props: { timestamp: number }) {
  const [isReady, setIsReady] = useState(false)
  useInterval(
    () => {
      if (isReady) {
        return
      }

      // TODO do something
    },
    isReady ? null : 5000
  )

  if (isReady) {
    return <Button href={`bundle/${props.timestamp}`}>Download Bundle</Button>
  } else {
    return (
      <div className="flex flex-row gap-5 items-center">
        <Spin />
        <div className="text-xl">Preparing your modpack</div>
      </div>
    )
  }
}
