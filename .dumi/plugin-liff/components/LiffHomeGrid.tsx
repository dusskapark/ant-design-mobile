import React from 'react'
import { Grid } from 'antd-mobile'
import { componentsByLang } from '../../plugin-gallery/use-gallery-state'
import styles from '../../plugin-gallery/gallery.less'
import { LiffBanner } from './LiffBanner'
import { useLiffContext } from './LiffProvider'

type LiffStatus = 'idle' | 'ready' | 'error'

interface Props {
  liffStatus: LiffStatus
  t: { guide1: string; guide2: string }
  goToComponent: (key: string) => void
  toDemoPaths: Record<string, string[]>
}

export const LiffHomeGrid = ({
  liffStatus,
  t,
  goToComponent,
  toDemoPaths,
}: Props) => {
  const { lang } = useLiffContext()
  const groups = componentsByLang[lang]

  return (
    <div>
      <LiffBanner status={liffStatus} />
      <div className={styles.guide}>
        <img
          src='https://gw.alipayobjects.com/zos/bmw-prod/b874caa9-4458-412a-9ac6-a61486180a62.svg'
          alt='logo'
          className={styles.logo}
        />
        <p>{t.guide1}</p>
        <p>
          {t.guide2}{' '}
          <a href={window.location.origin} target='_blank'>
            {window.location.origin}
          </a>
        </p>
      </div>
      {groups.map(group => {
        const items = group.children.filter(item => {
          const key = item.path.split('/').pop()!
          return (toDemoPaths[key]?.length ?? 0) > 0
        })
        if (items.length === 0) return null
        return (
          <div key={group.title}>
            <div className={styles.categoryHeader}>{group.title}</div>
            <Grid columns={2} gap={8} style={{ padding: '0 12px 12px' }}>
              {items.map(item => {
                const key = item.path.split('/').pop()!
                return (
                  <Grid.Item key={key} onClick={() => goToComponent(key)}>
                    <div className={styles.componentCard}>{item.title}</div>
                  </Grid.Item>
                )
              })}
            </Grid>
          </div>
        )
      })}
    </div>
  )
}
