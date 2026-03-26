import React from 'react'
// @ts-ignore
import liff from '@line/liff'
import { Button, CapsuleTabs, Toast } from 'antd-mobile'
import classNames from 'classnames'
import styles from '../../plugin-gallery/gallery.less'
import { buildFlexCarousel } from '../buildFlexCarousel'

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
    const url = `${window.location.origin}/liff/${currentComponent}`

    if (liffStatus !== 'ready' || !liff.isInClient()) {
      await navigator.clipboard.writeText(url).catch(() => {})
      Toast.show({ content: 'Link copied!', position: 'bottom' })
      return
    }

    const flexMsg = buildFlexCarousel(title, currentComponent, demoPaths)
    const context = liff.getContext()
    const isInChat =
      context?.type && !['none', 'external'].includes(context.type)

    if (isInChat) {
      try {
        await liff.sendMessages([flexMsg])
        Toast.show({ content: 'Shared to chat!', position: 'bottom' })
        return
      } catch {
        // INVALID_RECEIVER 등 실패 시 shareTargetPicker로 fallback
      }
    }

    try {
      await liff.shareTargetPicker([flexMsg])
      Toast.show({ content: 'Shared to LINE!', position: 'bottom' })
    } catch (e: any) {
      Toast.show({
        content: `Failed: ${e?.message ?? e}`,
        position: 'bottom',
        duration: 5000,
      })
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
