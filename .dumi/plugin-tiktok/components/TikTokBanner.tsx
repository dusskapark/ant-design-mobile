import React from 'react'

type TikTokStatus = 'idle' | 'ready' | 'error'

export const TikTokBanner = ({ status }: { status: TikTokStatus }) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      padding: '6px 12px',
      background: '#010101',
      color: '#fff',
      fontSize: 12,
      fontWeight: 600,
    }}
  >
    {/* TikTok music note icon */}
    <svg
      viewBox='0 0 24 24'
      width='14'
      height='14'
      fill='currentColor'
      xmlns='http://www.w3.org/2000/svg'
    >
      <path d='M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.76a4.85 4.85 0 01-1.01-.07z' />
    </svg>
    TikTok Mini App
    {status === 'ready' && (
      <span style={{ opacity: 0.7, marginLeft: 4 }}>· In-App</span>
    )}
    {status === 'error' && (
      <span style={{ opacity: 0.7, marginLeft: 4 }}>· Browser mode</span>
    )}
    {status === 'idle' && (
      <span style={{ opacity: 0.7, marginLeft: 4 }}>· Loading…</span>
    )}
  </div>
)
