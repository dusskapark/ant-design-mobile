import { useEffect, useLayoutEffect, useState } from 'react'
// @ts-ignore
import ComponentConfig from '@@/dumi/config'
// @ts-ignore
import DemosConfig from '@@/dumi/demos'
// @ts-ignore
import { usePrefersColor } from 'dumi/theme'
import { useDebounceEffect } from 'ahooks'
import { cloneDeep } from 'lodash'

export type Lang = 'zh' | 'en'

export type ComponentGroup = {
  title: string
  children: {
    title: string
    path: string
  }[]
}

export const componentsByLang: Record<Lang, ComponentGroup[]> = {
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

export const mapsByLang: Record<Lang, ReturnType<typeof buildMaps>> = {
  zh: buildMaps(componentsByLang.zh),
  en: buildMaps(componentsByLang.en),
}

export const i18n: Record<
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

export const useGalleryState = (history: any, match: any, basePath: string) => {
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

  const goBack = () => history.push(basePath)
  const goToComponent = (key: string) => history.push(`${basePath}/${key}`)

  return {
    lang,
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
    toTitle,
    t,
    goBack,
    goToComponent,
  }
}
