import React from 'react'
// @ts-ignore
import liff from '@line/liff'
import { Button, CapsuleTabs, Toast } from 'antd-mobile'
import classNames from 'classnames'
import styles from '../../plugin-gallery/gallery.less'

interface Props {
  demoPaths: string[]
  currentDemoIndex: number
  setCurrentDemoIndex: (i: number) => void
  title: string
  currentComponent: string
  liffStatus: 'idle' | 'ready' | 'error'
}

export const LiffDemoView = ({
  demoPaths,
  currentDemoIndex,
  setCurrentDemoIndex,
  title,
  currentComponent,
  liffStatus,
}: Props) => {
  const shareToLine = async () => {
    if (liffStatus !== 'ready' || !liff.isInClient()) {
      const url = `${window.location.origin}/liff/${currentComponent}`
      await navigator.clipboard.writeText(url).catch(() => {})
      Toast.show({ content: 'Link copied!', position: 'bottom' })
      return
    }
    try {
      await liff.sendMessages([
        {
          type: 'text',
          text: `Check out the ${title} component:\n${window.location.origin}/liff/${currentComponent}`,
        },
      ])
      Toast.show({ content: 'Shared to LINE!', position: 'bottom' })
    } catch {
      Toast.show({ content: 'Failed to share', position: 'bottom' })
    }
  }

  return (
    <div style={{ height: '100dvh' }} className={styles.liffGallery}>
      {demoPaths.length > 1 && (
        <div className={styles.demoSegment}>
          <CapsuleTabs
            activeKey={String(currentDemoIndex)}
            onChange={key => setCurrentDemoIndex(Number(key))}
          >
            {demoPaths.map((_, i) => (
              <CapsuleTabs.Tab key={String(i)} title={`Demo ${i + 1}`} />
            ))}
          </CapsuleTabs>
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
              '--background-color': '#06C755',
              '--border-color': '#06C755',
              '--text-color': '#fff',
            } as React.CSSProperties
          }
          onClick={shareToLine}
        >
          Share to LINE
        </Button>
      </div>
    </div>
  )
}
