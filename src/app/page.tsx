import { Button, Divider } from 'antd'

export default function Home() {
  return (
    <div className="h-full w-full flex flex-col items-center justify-center">
      <div className="flex flex-col items-center">
        {/* TODO add functionality */}
        <Button
          type="primary"
          size="large"
          style={{ height: 'auto' }}
          href="files/bundle.zip"
          download
        >
          <h2 className="text-4xl">Download the Bundle</h2>
        </Button>
        <Divider>or</Divider>
        <Button
          type="default"
          size="large"
          style={{ height: 'auto' }}
          href="modlist"
        >
          <h2 className="text-2xl">Download Individually</h2>
        </Button>
      </div>
    </div>
  )
}
