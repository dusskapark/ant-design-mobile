import React, { useEffect, useState } from 'react'
import {
  AppstoreOutlined,
  LeftOutlined,
  SearchOutlined,
  SettingOutlined,
} from '@ant-design/icons'
import { NavBar, SafeArea, Segmented, TabBar } from 'antd-mobile'
import classNames from 'classnames'
import styles from './gallery.less'
import { useGalleryState } from './use-gallery-state'
import { GalleryHomeGrid } from './components/GalleryHomeGrid'
import { GallerySearch } from './components/GallerySearch'
import { GallerySettings } from './components/GallerySettings'

type ActiveTab = 'home' | 'search' | 'settings'

const ACTIVE_TAB_KEY = 'gallery-active-tab'

export default (props: any) => {
  const [activeTab, setActiveTab] = useState<ActiveTab>(
    () => (sessionStorage.getItem(ACTIVE_TAB_KEY) as ActiveTab | null) ?? 'home'
  )

  const handleTabChange = (key: ActiveTab) => {
    setActiveTab(key)
    sessionStorage.setItem(ACTIVE_TAB_KEY, key)
  }
  const state = useGalleryState(props.history, props.match, '/gallery')
  const { currentComponent, currentDemoIndex, setCurrentDemoIndex, title } =
    state
  const demoPaths = currentComponent
    ? (state.toDemoPaths[currentComponent] ?? [])
    : []

  useEffect(() => {
    document.title = title
  }, [title])

  if (currentComponent && currentDemoIndex !== null) {
    return (
      <div style={{ height: '100dvh' }} className={styles.gallery}>
        <div className={styles.header}>
          <NavBar
            backIcon={<LeftOutlined />}
            onBack={state.goBack}
            right={
              demoPaths.length > 1 ? (
                <span className={styles.demoCounter}>
                  {currentDemoIndex + 1} / {demoPaths.length}
                </span>
              ) : null
            }
          >
            {title}
          </NavBar>
        </div>
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
      </div>
    )
  }

  return (
    <div style={{ height: '100dvh' }} className={styles.gallery}>
      <div className={styles.header}>
        <NavBar backIcon={false}>{title}</NavBar>
      </div>
      <div className={styles.body}>
        {activeTab === 'home' && (
          <GalleryHomeGrid
            t={state.t}
            goToComponent={state.goToComponent}
            toDemoPaths={state.toDemoPaths}
            lang={state.lang}
          />
        )}
        {activeTab === 'search' && (
          <GallerySearch
            goToComponent={state.goToComponent}
            toDemoPaths={state.toDemoPaths}
            lang={state.lang}
            searchPlaceholder={state.t.searchPlaceholder}
          />
        )}
        {activeTab === 'settings' && (
          <GallerySettings
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
          onChange={key => handleTabChange(key as ActiveTab)}
        >
          <TabBar.Item key='home' icon={<AppstoreOutlined />} title='Home' />
          <TabBar.Item key='search' icon={<SearchOutlined />} title='Search' />
          <TabBar.Item
            key='settings'
            icon={<SettingOutlined />}
            title='Settings'
          />
        </TabBar>
        <SafeArea position='bottom' />
      </div>
    </div>
  )
}
