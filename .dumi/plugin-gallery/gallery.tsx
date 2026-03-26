import React, { useEffect, useLayoutEffect, useState } from 'react'
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

const SunSvg = () => (
  <svg
    viewBox='0 0 1024 1024'
    xmlns='http://www.w3.org/2000/svg'
    width='18'
    height='18'
  >
    <path d='M915.2 476.16h-43.968c-24.704 0-44.736 16-44.736 35.84s20.032 35.904 44.736 35.904H915.2c24.768 0 44.8-16.064 44.8-35.904s-20.032-35.84-44.8-35.84zM512 265.6c-136.704 0-246.464 109.824-246.464 246.4 0 136.704 109.76 246.464 246.464 246.464S758.4 648.704 758.4 512c0-136.576-109.696-246.4-246.4-246.4z m0 425.6c-99.008 0-179.2-80.128-179.2-179.2 0-98.944 80.192-179.2 179.2-179.2S691.2 413.056 691.2 512c0 99.072-80.192 179.2-179.2 179.2zM197.44 512c0-19.84-19.136-35.84-43.904-35.84H108.8c-24.768 0-44.8 16-44.8 35.84s20.032 35.904 44.8 35.904h44.736c24.768 0 43.904-16.064 43.904-35.904zM512 198.464c19.776 0 35.84-20.032 35.84-44.8v-44.8C547.84 84.032 531.84 64 512 64s-35.904 20.032-35.904 44.8v44.8c0 24.768 16.128 44.864 35.904 44.864z m0 627.136c-19.776 0-35.904 20.032-35.904 44.8v44.736C476.096 940.032 492.16 960 512 960s35.84-20.032 35.84-44.8v-44.736c0-24.768-16.064-44.864-35.84-44.864z m329.92-592.832c17.472-17.536 20.288-43.072 6.4-57.024-14.016-14.016-39.488-11.2-57.024 6.336-4.736 4.864-26.496 26.496-31.36 31.36-17.472 17.472-20.288 43.008-6.336 57.024 13.952 14.016 39.488 11.2 57.024-6.336 4.8-4.864 26.496-26.56 31.296-31.36zM213.376 759.936c-4.864 4.8-26.56 26.624-31.36 31.36-17.472 17.472-20.288 42.944-6.4 56.96 14.016 13.952 39.552 11.2 57.024-6.336 4.8-4.736 26.56-26.496 31.36-31.36 17.472-17.472 20.288-43.008 6.336-56.96-14.016-13.952-39.552-11.072-56.96 6.336z m19.328-577.92c-17.536-17.536-43.008-20.352-57.024-6.336-14.08 14.016-11.136 39.488 6.336 57.024 4.864 4.864 26.496 26.56 31.36 31.424 17.536 17.408 43.008 20.288 56.96 6.336 14.016-14.016 11.264-39.488-6.336-57.024-4.736-4.864-26.496-26.56-31.296-31.424z m527.168 628.608c4.864 4.864 26.624 26.624 31.36 31.424 17.536 17.408 43.072 20.224 57.088 6.336 13.952-14.016 11.072-39.552-6.4-57.024-4.864-4.8-26.56-26.496-31.36-31.36-17.472-17.408-43.072-20.288-57.024-6.336-13.952 14.016-11.008 39.488 6.336 56.96z' />
  </svg>
)

const MoonSvg = () => (
  <svg
    viewBox='0 0 1024 1024'
    xmlns='http://www.w3.org/2000/svg'
    width='18'
    height='18'
  >
    <path d='M991.816611 674.909091a69.166545 69.166545 0 0 0-51.665455-23.272727 70.795636 70.795636 0 0 0-27.438545 5.585454A415.674182 415.674182 0 0 1 754.993338 698.181818c-209.594182 0-393.472-184.785455-393.472-395.636363 0-52.363636 38.539636-119.621818 69.515637-173.614546 4.887273-8.610909 9.634909-16.756364 14.103272-24.901818A69.818182 69.818182 0 0 0 384.631156 0a70.842182 70.842182 0 0 0-27.438545 5.585455C161.678429 90.298182 14.362065 307.898182 14.362065 512c0 282.298182 238.824727 512 532.38691 512a522.286545 522.286545 0 0 0 453.957818-268.334545A69.818182 69.818182 0 0 0 991.816611 674.909091zM546.679156 954.181818c-248.785455 0-462.941091-192-462.941091-442.181818 0-186.647273 140.637091-372.829091 300.939637-442.181818-36.817455 65.629091-92.578909 151.970909-92.578909 232.727273 0 250.181818 214.109091 465.454545 462.917818 465.454545a488.331636 488.331636 0 0 0 185.181091-46.545455 453.003636 453.003636 0 0 1-393.565091 232.727273z' />
  </svg>
)

export default props => {
  const [lang, setLang] = useState<Lang>('en')
  const [color, setColor] = usePrefersColor()
  const [currentDemoIndex, setCurrentDemoIndex] = useState<number | null>(null)
  const [currentComponent, setCurrentComponent] = useState('')
  const [title, setTitle] = useState('Ant Design Mobile')
  const [searchValue, setSearchValue] = useState<string>('')
  const [componentGroups, setComponentGroups] = useState(componentsByLang['en'])
  const { history, match } = props

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
      {isDark ? <SunSvg /> : <MoonSvg />}
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
            history.push('/gallery')
          }}
          right={navRight}
        >
          {title}
        </NavBar>
      </div>
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
                      history.push(`/gallery/${key}`)
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
