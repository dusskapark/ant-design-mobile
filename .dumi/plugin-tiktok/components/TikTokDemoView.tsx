import React from 'react'
import { Button, Segmented, Toast } from 'antd-mobile'
import classNames from 'classnames'
import styles from '../../plugin-gallery/gallery.less'
import { useTikTokContext } from './TikTokProvider'

// TikTok Mini App global
declare const tt: any

interface Props {
  demoPaths: string[]
  currentDemoIndex: number
  setCurrentDemoIndex: (i: number) => void
  title: string
  currentComponent: string
  ttStatus: 'idle' | 'ready' | 'error'
}

export const TikTokDemoView = ({
  demoPaths,
  currentDemoIndex,
  setCurrentDemoIndex,
  title,
  currentComponent,
  ttStatus,
}: Props) => {
  const { isInApp } = useTikTokContext()

  const shareToTikTok = async () => {
    const url = `${window.location.origin}/tiktok/${currentComponent}`
    const shareTitle = `${title} — antd-mobile component demo`

    // In TikTok Mini App: use tt.shareAppMessage
    if (ttStatus === 'ready' && isInApp && typeof tt !== 'undefined') {
      try {
        tt.shareAppMessage({
          title: shareTitle,
          path: `/tiktok/${currentComponent}`,
          success: () => Toast.show({ content: 'Shared!', position: 'bottom' }),
          fail: () => {
            navigator.clipboard.writeText(url).catch(() => {})
            Toast.show({ content: 'Link copied!', position: 'bottom' })
          },
        })
        return
      } catch {
        // Fallback below
      }
    }

    // Web Share API fallback
    if (navigator.share) {
      try {
        await navigator.share({ title: shareTitle, url })
        Toast.show({ content: 'Shared!', position: 'bottom' })
        return
      } catch {
        // Cancelled or unsupported
      }
    }

    // Clipboard fallback
    await navigator.clipboard.writeText(url).catch(() => {})
    Toast.show({ content: 'Link copied!', position: 'bottom' })
  }

  return (
    <div style={{ height: '100dvh' }} className={styles.liffGallery}>
      {demoPaths.length > 1 && (
        <div className={styles.demoSegment}>
          <Segmented
            block
            value={currentDemoIndex}
            onChange={val => setCurrentDemoIndex(Number(val))}
            options={demoPaths.map((_, i) => ({
              label: `Demo ${i + 1}`,
              value: i,
            }))}
          />
        </div>
      )}
      <div className={classNames(styles.body, styles.demoBody)}>
        <iframe
          src={'/~demos/' + demoPaths[currentDemoIndex]}
          style={{ width: window.innerWidth, height: '100%', border: 'none' }}
        />
      </div>
      <div className={styles.shareBar}>
        <Button
          block
          style={
            {
              '--background-color': '#010101',
              '--border-color': '#010101',
              '--text-color': '#fff',
            } as React.CSSProperties
          }
          onClick={shareToTikTok}
        >
          Share to TikTok
        </Button>
      </div>
    </div>
  )
}
