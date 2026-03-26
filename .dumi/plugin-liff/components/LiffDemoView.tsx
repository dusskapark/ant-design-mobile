import React from 'react'
import { Button, CapsuleTabs } from 'antd-mobile'
import classNames from 'classnames'
import styles from '../../plugin-gallery/gallery.less'

interface Props {
  demoPaths: string[]
  currentDemoIndex: number
  setCurrentDemoIndex: (i: number) => void
  title: string
  currentComponent: string
}

export const LiffDemoView = ({
  demoPaths,
  currentDemoIndex,
  setCurrentDemoIndex,
  title,
  currentComponent,
}: Props) => {
  const shareToLine = async () => {
    try {
      // @ts-ignore
      const liff = (await import('@line/liff')).default
      if (!liff.isInClient()) return
      await liff.sendMessages([
        {
          type: 'text',
          text: `Check out the ${title} component:\n${window.location.origin}/liff/${currentComponent}`,
        },
      ])
    } catch {
      /* ignore */
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
