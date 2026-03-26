import React, { useEffect, useState } from 'react'
// @ts-ignore
import liff from '@line/liff'
import GalleryCore from '../plugin-gallery/gallery-core'

const LIFF_ID = process.env.LIFF_ID || ''

const LiffBanner = ({ status }: { status: 'idle' | 'ready' | 'error' }) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      padding: '6px 12px',
      background: '#06C755',
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
      <path d='M19.952 10.357C19.952 5.944 15.513 2.38 10.056 2.38S.16 5.944.16 10.357c0 3.977 3.527 7.313 8.293 7.944.323.07.763.213.874.49.1.25.065.643.032.896l-.142.85c-.043.25-.2.977.856.533 1.057-.444 5.706-3.36 7.782-5.753 1.435-1.576 2.097-3.17 2.097-4.96z' />
    </svg>
    LINE LIFF
    {status === 'ready' && (
      <span style={{ opacity: 0.8, marginLeft: 4 }}>· Ready</span>
    )}
    {status === 'error' && (
      <span style={{ opacity: 0.8, marginLeft: 4 }}>· Browser mode</span>
    )}
  </div>
)

export default (props: any) => {
  const [liffStatus, setLiffStatus] = useState<'idle' | 'ready' | 'error'>(
    'idle'
  )

  useEffect(() => {
    if (!LIFF_ID) {
      setLiffStatus('error')
      return
    }
    liff
      .init({ liffId: LIFF_ID })
      .then(() => setLiffStatus('ready'))
      .catch(() => setLiffStatus('error'))
  }, [])

  return (
    <GalleryCore
      {...props}
      basePath='/liff'
      platformBanner={<LiffBanner status={liffStatus} />}
    />
  )
}
