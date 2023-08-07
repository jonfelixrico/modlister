import { Divider } from 'antd'

export default function Home() {
  return (
    <div className="h-full w-full flex flex-col items-center justify-center">
      <div className="flex flex-col items-center">
        <h2 className="text-5xl">Download the Bundle</h2>
        <Divider>or</Divider>
        <h2 className="text-3xl">Download Individually</h2>
      </div>
    </div>
  )
}
