'use client'

import { Button, Spin } from 'antd'
import { useState } from 'react'
import { useInterval } from 'react-use'

export default function ModpackSplash(props: { timestamp: number }) {
  const [isReady, setIsReady] = useState(false)
  useInterval(
    async () => {
      if (isReady) {
        return
      }

      const response = await fetch(`bundle/${props.timestamp}`, {
        cache: 'no-cache',
      })

      if (response.ok) {
        setIsReady(true)
      } else {
        console.log('Not yet ready. HTTP status %d', response.status)
      }
    },
    isReady ? null : 5_000
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
