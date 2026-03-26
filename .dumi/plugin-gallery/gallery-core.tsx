import React, { useEffect, useLayoutEffect, useState } from 'react'
import { MoonOutlined, SunOutlined } from '@ant-design/icons'
import { List, NavBar, Popover, SafeArea, SearchBar } from 'antd-mobile'
// @ts-ignore
import ComponentConfig from '@@/dumi/config'
// @ts-ignore
import DemosConfig from '@@/dumi/demos'
// @ts-ignore
import { usePrefersColor } from 'dumi/theme'
import styles from './gallery.less'
import classNames from 'classnames'
import { useDebounceEffect } from 'ahooks'
import { cloneDeep } from 'lodash'

type Lang = 'zh' | 'en'

type ComponentGroup = {
  title: string
  children: {
    title: string
    path: string
  }[]
}

const componentsByLang: Record<Lang, ComponentGroup[]> = {
  zh: ComponentConfig['menus']['zh']['/zh/components'],
  en: ComponentConfig['menus']['en']['/components'],
}

const demos = Object.keys(DemosConfig)

const buildMaps = (components: ComponentGroup[]) => {
  const toDemoPaths: Record<string, string[]> = {}
  const toTitle: Record<string, string> = {}
  components.forEach(group => {
    group.children.forEach(item => {
      const keyArrs = item.path.split('/')
      const key = keyArrs[keyArrs.length - 1]
      toDemoPaths[key] = demos.filter(val => val.startsWith(`${key}-demo`))
      toTitle[key] = item.title
    })
  })
  return { toDemoPaths, toTitle }
}

const mapsByLang: Record<Lang, ReturnType<typeof buildMaps>> = {
  zh: buildMaps(componentsByLang.zh),
  en: buildMaps(componentsByLang.en),
}

const i18n: Record<
  Lang,
  {
    guide1: string
    guide2: string
    searchPlaceholder: string
    toggleLabel: string
  }
> = {
  zh: {
    guide1: '下面是一些 Ant Design Mobile 的组件 demo，可以点进去试一试',
    guide2: '如果你想查阅完整的组件文档，请在桌面浏览器中访问：',
    searchPlaceholder: '搜索组件',
    toggleLabel: 'EN',
  },
  en: {
    guide1: 'Here are some Ant Design Mobile component demos. Tap to try them.',
    guide2: 'For the full documentation, visit in a desktop browser:',
    searchPlaceholder: 'Search components',
    toggleLabel: '中文',
  },
}

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
  const [lang, setLang] = useState<Lang>('en')
  const [color, setColor] = usePrefersColor()
  const [currentDemoIndex, setCurrentDemoIndex] = useState<number | null>(null)
  const [currentComponent, setCurrentComponent] = useState('')
  const [title, setTitle] = useState('Ant Design Mobile')
  const [searchValue, setSearchValue] = useState<string>('')
  const [componentGroups, setComponentGroups] = useState(componentsByLang['en'])

  const { toDemoPaths, toTitle } = mapsByLang[lang]
  const t = i18n[lang]
  const isDark = color === 'dark'

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  })

  useLayoutEffect(() => {
    const { component = '' } = match.params
    setCurrentComponent(component)
    setTitle(toTitle[component] || 'Ant Design Mobile')
  }, [match.params, lang])

  useLayoutEffect(() => {
    if (!currentComponent) {
      setCurrentDemoIndex(null)
    } else {
      setCurrentDemoIndex(0)
    }
  }, [currentComponent])

  useEffect(() => {
    setSearchValue('')
    setComponentGroups(componentsByLang[lang])
    if (currentComponent) {
      setTitle(toTitle[currentComponent] || 'Ant Design Mobile')
    }
  }, [lang])

  useDebounceEffect(
    () => {
      let filterGroups = cloneDeep(componentsByLang[lang])
      filterGroups.forEach(group => {
        group.children = group.children.filter(item =>
          item.title.toLowerCase().includes(searchValue.toLowerCase())
        )
      })
      setComponentGroups(filterGroups.filter(group => group.children.length))
    },
    [searchValue, lang],
    {
      wait: 200,
      leading: false,
      trailing: true,
    }
  )

  const toggleTheme = () => {
    const next = isDark ? 'light' : 'dark'
    setColor(next)
    document.documentElement.setAttribute('data-prefers-color-scheme', next)
  }

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
          onBack={() => {
            history.push(basePath)
          }}
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

        {componentGroups.map(group => {
          return (
            <List key={group.title} header={group.title}>
              {group.children.map(item => {
                const keyArrs = item.path.split('/')
                const key = keyArrs[keyArrs.length - 1]
                const demoPaths = toDemoPaths[key]
                if (demoPaths && demoPaths.length === 0) return null
                return (
                  <List.Item
                    key={key}
                    onClick={() => {
                      history.push(`${basePath}/${key}`)
                    }}
                  >
                    {item.title}
                  </List.Item>
                )
              })}
            </List>
          )
        })}
        <SafeArea position='bottom' />
      </div>
    </div>
  )
}
