import React, { useEffect, useState } from 'react'
// @ts-ignore
import liff from '@line/liff'
import { SafeArea, TabBar } from 'antd-mobile'
import {
  AppstoreOutlined,
  SearchOutlined,
  SettingOutlined,
} from '@ant-design/icons'
import { useGalleryState } from '../plugin-gallery/use-gallery-state'
import styles from '../plugin-gallery/gallery.less'
import { LiffProvider, type LiffProfile } from './components/LiffProvider'
import { LiffDemoView } from './components/LiffDemoView'
import { LiffHomeGrid } from './components/LiffHomeGrid'
import { LiffSearch } from './components/LiffSearch'
import { LiffSettings } from './components/LiffSettings'

const LIFF_ID = process.env.UMI_APP_LIFF_ID || ''

type ActiveTab = 'home' | 'search' | 'settings'

export default (props: any) => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('home')
  const [liffStatus, setLiffStatus] = useState<'idle' | 'ready' | 'error'>(
    'idle'
  )
  const [profile, setProfile] = useState<LiffProfile | null>(null)
  const [liffVersion, setLiffVersion] = useState<string | null>(null)
  const [lineVersion, setLineVersion] = useState<string | null>(null)
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
      .then(() => {
        setLiffStatus('ready')
        setLiffVersion(liff.getVersion())
        setLineVersion(liff.getLineVersion())
        const appLang: string = liff.getAppLanguage() ?? ''
        state.setLang(appLang.startsWith('zh') ? 'zh' : 'en')
        // 캐러셀 버튼 딥링크: ?component=button 파라미터로 바로 컴포넌트로 이동
        const params = new URLSearchParams(window.location.search)
        const deepLink = params.get('component')
        if (deepLink) state.goToComponent(deepLink)
        return liff.getProfile()
      })
      .then((p: LiffProfile) => setProfile(p))
      .catch(() => setLiffStatus('error'))
  }, [])

  useEffect(() => {
    document.title = title
  }, [title])

  return (
    <LiffProvider
      lang={state.lang}
      setLang={state.setLang}
      isDark={state.isDark}
      toggleTheme={state.toggleTheme}
      profile={profile}
      liffVersion={liffVersion}
      lineVersion={lineVersion}
    >
      {currentComponent && currentDemoIndex !== null ? (
        <LiffDemoView
          demoPaths={demoPaths}
          currentDemoIndex={currentDemoIndex}
          setCurrentDemoIndex={state.setCurrentDemoIndex}
          title={title}
          currentComponent={currentComponent}
          liffStatus={liffStatus}
        />
      ) : (
        <div style={{ height: '100dvh' }} className={styles.liffGallery}>
          <div className={styles.body}>
            {activeTab === 'home' && (
              <LiffHomeGrid
                liffStatus={liffStatus}
                t={state.t}
                goToComponent={state.goToComponent}
                toDemoPaths={toDemoPaths}
              />
            )}
            {activeTab === 'search' && (
              <LiffSearch
                goToComponent={state.goToComponent}
                toDemoPaths={toDemoPaths}
              />
            )}
            {activeTab === 'settings' && <LiffSettings />}
          </div>
          <div className={styles.tabBarWrapper}>
            <TabBar
              activeKey={activeTab}
              onChange={key => setActiveTab(key as ActiveTab)}
            >
              <TabBar.Item
                key='home'
                icon={<AppstoreOutlined />}
                title='Home'
              />
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
      )}
    </LiffProvider>
  )
}
