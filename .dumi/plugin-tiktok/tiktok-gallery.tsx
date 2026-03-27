import React, { useEffect, useState } from 'react'
import { SafeArea, TabBar } from 'antd-mobile'
import {
  AppstoreOutlined,
  SearchOutlined,
  SettingOutlined,
} from '@ant-design/icons'
import { useGalleryState } from '../plugin-gallery/use-gallery-state'
import styles from '../plugin-gallery/gallery.less'
import { TikTokProvider, type TikTokProfile } from './components/TikTokProvider'
import { TikTokDemoView } from './components/TikTokDemoView'
import { TikTokHomeGrid } from './components/TikTokHomeGrid'
import { TikTokSearch } from './components/TikTokSearch'
import { TikTokSettings } from './components/TikTokSettings'

// TikTok Mini App global
declare const tt: any

type ActiveTab = 'home' | 'search' | 'settings'

/** Detect TikTok Mini App environment */
function detectTikTokEnv(): boolean {
  return typeof tt !== 'undefined' || /TikTok|Douyin/i.test(navigator.userAgent)
}

export default (props: any) => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('home')
  const [ttStatus, setTtStatus] = useState<'idle' | 'ready' | 'error'>('idle')
  const [profile, setProfile] = useState<TikTokProfile | null>(null)
  const [ttVersion, setTtVersion] = useState<string | null>(null)
  const [isInApp] = useState(() => detectTikTokEnv())
  const state = useGalleryState(props.history, props.match, '/tiktok')
  const { currentComponent, currentDemoIndex, toDemoPaths, title } = state
  const demoPaths = currentComponent
    ? (toDemoPaths[currentComponent] ?? [])
    : []

  useEffect(() => {
    if (!isInApp || typeof tt === 'undefined') {
      setTtStatus('error')
      return
    }

    try {
      // Get TikTok SDK version if available
      if (tt.getSystemInfo) {
        tt.getSystemInfo({
          success: (res: any) => {
            setTtVersion(res.SDKVersion ?? res.version ?? null)
            setTtStatus('ready')
          },
          fail: () => setTtStatus('ready'),
        })
      } else {
        setTtStatus('ready')
      }

      // Get user profile
      if (tt.getUserInfo) {
        tt.getUserInfo({
          withCredentials: false,
          success: (res: any) => {
            const info = res.userInfo ?? res
            setProfile({
              nickName: info.nickName ?? info.nickname ?? '',
              avatarUrl: info.avatarUrl ?? info.avatar ?? undefined,
              openId: res.openId ?? undefined,
            })
          },
          fail: () => {
            // Profile not available (browser mode or permission denied)
          },
        })
      }

      // Deep link: navigate directly to a component via ?component= param
      const params = new URLSearchParams(window.location.search)
      const deepLink = params.get('component')
      if (deepLink) {
        window.history.replaceState({}, '', window.location.pathname)
        state.goToComponent(deepLink)
      }
    } catch {
      setTtStatus('error')
    }
  }, [])

  useEffect(() => {
    document.title = title
  }, [title])

  return (
    <TikTokProvider
      lang={state.lang}
      setLang={state.setLang}
      isDark={state.isDark}
      toggleTheme={state.toggleTheme}
      profile={profile}
      ttVersion={ttVersion}
      isInApp={isInApp}
    >
      {currentComponent && currentDemoIndex !== null ? (
        <TikTokDemoView
          demoPaths={demoPaths}
          currentDemoIndex={currentDemoIndex}
          setCurrentDemoIndex={state.setCurrentDemoIndex}
          title={title}
          currentComponent={currentComponent}
          ttStatus={ttStatus}
        />
      ) : (
        <div style={{ height: '100dvh' }} className={styles.liffGallery}>
          <div className={styles.body}>
            {activeTab === 'home' && (
              <TikTokHomeGrid
                ttStatus={ttStatus}
                t={state.t}
                goToComponent={state.goToComponent}
                toDemoPaths={toDemoPaths}
              />
            )}
            {activeTab === 'search' && (
              <TikTokSearch
                goToComponent={state.goToComponent}
                toDemoPaths={toDemoPaths}
              />
            )}
            {activeTab === 'settings' && <TikTokSettings />}
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
    </TikTokProvider>
  )
}
