import React, { useEffect, useMemo, useState } from 'react'
// @ts-ignore
import liff from '@line/liff'
import {
  Button,
  CapsuleTabs,
  ConfigProvider,
  Grid,
  IndexBar,
  List,
  Picker,
  SafeArea,
  SearchBar,
  Switch,
  TabBar,
} from 'antd-mobile'
import enUS from 'antd-mobile/es/locales/en-US'
import zhCN from 'antd-mobile/es/locales/zh-CN'
import {
  AppstoreOutlined,
  SearchOutlined,
  SettingOutlined,
} from '@ant-design/icons'
import classNames from 'classnames'
import {
  componentsByLang,
  useGalleryState,
  type Lang,
} from '../plugin-gallery/use-gallery-state'
import styles from '../plugin-gallery/gallery.less'

const LIFF_ID = process.env.LIFF_ID || ''

type ActiveTab = 'home' | 'search' | 'settings'

// ── LIFF Status Banner ─────────────────────────────────────────────────────

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

// ── Home Tab: Banner + guide info + category card grid ────────────────────

const LiffHomeGrid = ({
  lang,
  liffStatus,
  t,
  goToComponent,
  toDemoPaths,
}: {
  lang: Lang
  liffStatus: 'idle' | 'ready' | 'error'
  t: { guide1: string; guide2: string }
  goToComponent: (key: string) => void
  toDemoPaths: Record<string, string[]>
}) => {
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

// ── Search Tab: A-Z IndexBar + SearchBar ───────────────────────────────────

const LiffSearch = ({
  lang,
  goToComponent,
  toDemoPaths,
}: {
  lang: Lang
  goToComponent: (key: string) => void
  toDemoPaths: Record<string, string[]>
}) => {
  const [searchValue, setSearchValue] = useState('')

  const alphabeticGroups = useMemo(() => {
    const allItems = componentsByLang[lang].flatMap(g => g.children)
    const filtered = searchValue
      ? allItems.filter(item =>
          item.title.toLowerCase().includes(searchValue.toLowerCase())
        )
      : allItems

    const byLetter: Record<string, typeof filtered> = {}
    filtered.forEach(item => {
      const letter = item.title[0].toUpperCase()
      if (!byLetter[letter]) byLetter[letter] = []
      byLetter[letter].push(item)
    })

    return Object.entries(byLetter)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([letter, items]) => ({
        letter,
        items: items.sort((a, b) => a.title.localeCompare(b.title)),
      }))
  }, [lang, searchValue])

  return (
    <>
      <div className={styles.search}>
        <SearchBar
          value={searchValue}
          onChange={setSearchValue}
          placeholder={lang === 'zh' ? '搜索组件' : 'Search components'}
        />
      </div>
      <IndexBar>
        {alphabeticGroups.map(({ letter, items }) => (
          <IndexBar.Panel
            key={letter}
            index={letter}
            title={letter}
            brief={letter}
          >
            <List>
              {items.map(item => {
                const key = item.path.split('/').pop()!
                if (!toDemoPaths[key]?.length) return null
                return (
                  <List.Item key={key} onClick={() => goToComponent(key)}>
                    {item.title}
                  </List.Item>
                )
              })}
            </List>
          </IndexBar.Panel>
        ))}
      </IndexBar>
    </>
  )
}

// ── Settings Tab: iOS-style List + Picker + Switch ────────────────────────

const LiffSettings = ({
  lang,
  setLang,
  isDark,
  toggleTheme,
}: {
  lang: Lang
  setLang: (l: Lang) => void
  isDark: boolean
  toggleTheme: () => void
}) => {
  const [pickerVisible, setPickerVisible] = useState(false)
  const langLabel = lang === 'en' ? 'English' : '中文'

  return (
    <>
      <List header='Theme Settings'>
        <List.Item
          extra={<span style={{ color: '#888' }}>{langLabel}</span>}
          onClick={() => setPickerVisible(true)}
        >
          Language
        </List.Item>
        <List.Item
          extra={
            <Switch
              checked={isDark}
              onChange={checked => {
                if (checked !== isDark) toggleTheme()
              }}
            />
          }
        >
          Dark Mode
        </List.Item>
      </List>
      <Picker
        columns={[
          [
            { label: 'English', value: 'en' },
            { label: '中文', value: 'zh' },
          ],
        ]}
        visible={pickerVisible}
        onClose={() => setPickerVisible(false)}
        value={[lang]}
        onConfirm={val => {
          if (val[0]) setLang(val[0] as Lang)
        }}
      />
    </>
  )
}

// ── Main component ─────────────────────────────────────────────────────────

export default (props: any) => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('home')
  const [liffStatus, setLiffStatus] = useState<'idle' | 'ready' | 'error'>(
    'idle'
  )
  const state = useGalleryState(props.history, props.match, '/liff')
  const { currentComponent, currentDemoIndex, toDemoPaths, title } = state
  const demoPaths = currentComponent
    ? (toDemoPaths[currentComponent] ?? [])
    : []

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

  const shareToLine = async () => {
    try {
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

  const locale = state.lang === 'en' ? enUS : zhCN

  // Demo view
  if (currentComponent && currentDemoIndex !== null) {
    return (
      <ConfigProvider locale={locale}>
        <div style={{ height: '100dvh' }} className={styles.liffGallery}>
          {demoPaths.length > 1 && (
            <div className={styles.demoSegment}>
              <CapsuleTabs
                activeKey={String(currentDemoIndex)}
                onChange={key => state.setCurrentDemoIndex(Number(key))}
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
              style={{
                width: window.innerWidth,
                height: '100%',
                border: 'none',
              }}
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
      </ConfigProvider>
    )
  }

  // Home / Search / Settings view
  return (
    <ConfigProvider locale={locale}>
      <div style={{ height: '100dvh' }} className={styles.liffGallery}>
        <div className={styles.body}>
          {activeTab === 'home' && (
            <LiffHomeGrid
              lang={state.lang}
              liffStatus={liffStatus}
              t={state.t}
              goToComponent={state.goToComponent}
              toDemoPaths={toDemoPaths}
            />
          )}
          {activeTab === 'search' && (
            <LiffSearch
              lang={state.lang}
              goToComponent={state.goToComponent}
              toDemoPaths={toDemoPaths}
            />
          )}
          {activeTab === 'settings' && (
            <LiffSettings
              lang={state.lang}
              setLang={state.setLang}
              isDark={state.isDark}
              toggleTheme={state.toggleTheme}
            />
          )}
        </div>
        <div className={styles.tabBarWrapper}>
          <TabBar
            activeKey={activeTab}
            onChange={key => setActiveTab(key as ActiveTab)}
          >
            <TabBar.Item key='home' icon={<AppstoreOutlined />} title='Home' />
            <TabBar.Item
              key='search'
              icon={<SearchOutlined />}
              title='Search'
            />
            <TabBar.Item
              key='settings'
              icon={<SettingOutlined />}
              title='Settings'
            />
          </TabBar>
          <SafeArea position='bottom' />
        </div>
      </div>
    </ConfigProvider>
  )
}
