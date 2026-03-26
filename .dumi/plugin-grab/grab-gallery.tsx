import React, { useEffect, useState } from 'react'
import GalleryCore from '../plugin-gallery/gallery-core'

type GrabEnv = 'grab' | 'browser'

const detectGrabEnv = (): GrabEnv => {
  if (typeof window === 'undefined') return 'browser'
  // Grab PAX app injects window.GrabMiniApp or uses a 'GrabApp' user-agent string
  const ua = navigator.userAgent || ''
  if (
    (window as any).GrabMiniApp ||
    ua.includes('GrabApp') ||
    ua.includes('Grab/')
  ) {
    return 'grab'
  }
  return 'browser'
}

const GrabBanner = ({ env }: { env: GrabEnv }) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      padding: '6px 12px',
      background: '#00b14f',
      color: '#fff',
      fontSize: 12,
      fontWeight: 600,
    }}
  >
    <svg
      viewBox='0 0 24 24'
      width='14'
      height='14'
      fill='currentColor'
      xmlns='http://www.w3.org/2000/svg'
    >
      <path d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z' />
    </svg>
    Grab Mini-App
    {env === 'grab' && (
      <span style={{ opacity: 0.8, marginLeft: 4 }}>· In-App</span>
    )}
    {env === 'browser' && (
      <span style={{ opacity: 0.8, marginLeft: 4 }}>· Browser mode</span>
    )}
  </div>
)

export default (props: any) => {
  const [env, setEnv] = useState<GrabEnv>('browser')

  useEffect(() => {
    setEnv(detectGrabEnv())
  }, [])

  return (
    <GalleryCore
      {...props}
      basePath='/grab'
      platformBanner={<GrabBanner env={env} />}
    />
  )
}
