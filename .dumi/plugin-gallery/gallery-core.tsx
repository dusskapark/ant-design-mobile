import React from 'react'
import { MoonOutlined, SunOutlined } from '@ant-design/icons'
import {
  IndexBar,
  List,
  NavBar,
  Popover,
  SafeArea,
  SearchBar,
} from 'antd-mobile'
import styles from './gallery.less'
import classNames from 'classnames'
import { useGalleryState } from './use-gallery-state'

interface GalleryCoreProps {
  history: any
  match: any
  basePath: string
  platformBanner?: React.ReactNode
}

export default ({
  history,
  match,
  basePath,
  platformBanner,
}: GalleryCoreProps) => {
  const {
    setLang,
    isDark,
    toggleTheme,
    currentDemoIndex,
    setCurrentDemoIndex,
    currentComponent,
    title,
    searchValue,
    setSearchValue,
    componentGroups,
    toDemoPaths,
    t,
    goBack,
    goToComponent,
  } = useGalleryState(history, match, basePath)

  const themeToggleBtn = (
    <button
      className={styles.themeToggle}
      onClick={toggleTheme}
      title={isDark ? 'Switch to light' : 'Switch to dark'}
    >
      {isDark ? (
        <SunOutlined style={{ fontSize: 18 }} />
      ) : (
        <MoonOutlined style={{ fontSize: 18 }} />
      )}
    </button>
  )

  const localeToggleBtn = (
    <div
      className={styles.localeToggle}
      onClick={() => setLang(l => (l === 'zh' ? 'en' : 'zh'))}
    >
      {t.toggleLabel}
    </div>
  )

  const demoSwitcher = currentComponent && currentDemoIndex !== null && (
    <Popover.Menu
      trigger='click'
      placement='bottomRight'
      actions={toDemoPaths[currentComponent].map((_, index) => ({
        text: `Demo${index + 1}`,
        onClick: () => {
          setCurrentDemoIndex(index)
        },
      }))}
    >
      <a className={styles.demoSwitcher}>
        {currentDemoIndex + 1} / {toDemoPaths[currentComponent].length}
      </a>
    </Popover.Menu>
  )

  const navRight = (
    <div className={styles.navActions}>
      {currentDemoIndex === null ? localeToggleBtn : demoSwitcher}
      {themeToggleBtn}
    </div>
  )

  return (
    <div style={{ height: window.innerHeight }} className={styles.gallery}>
      <div className={styles.header}>
        <NavBar
          backArrow={currentDemoIndex !== null}
          onBack={goBack}
          right={navRight}
        >
          {title}
        </NavBar>
      </div>
      {platformBanner && currentDemoIndex === null && (
        <div className={styles.platformBanner}>{platformBanner}</div>
      )}
      {currentComponent && currentDemoIndex !== null && (
        <div className={classNames(styles.body, styles.demoBody)}>
          <iframe
            src={'/~demos/' + toDemoPaths[currentComponent][currentDemoIndex]}
            style={{
              width: window.innerWidth,
              height: '100%',
              border: 'none',
            }}
          />
        </div>
      )}
      <div className={styles.body} hidden={currentDemoIndex !== null}>
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
        <div className={styles.search}>
          <SearchBar
            placeholder={t.searchPlaceholder}
            value={searchValue}
            onChange={val => setSearchValue(val)}
          />
        </div>

        <IndexBar>
          {componentGroups.map(group => (
            <IndexBar.Panel
              key={group.title}
              index={group.title}
              title={group.title}
              brief={group.title.substring(0, 2)}
            >
              <List>
                {group.children.map(item => {
                  const keyArrs = item.path.split('/')
                  const key = keyArrs[keyArrs.length - 1]
                  const demoPaths = toDemoPaths[key]
                  if (demoPaths && demoPaths.length === 0) return null
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
        <SafeArea position='bottom' />
      </div>
    </div>
  )
}
