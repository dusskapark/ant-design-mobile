import React, { useMemo, useState } from 'react'
import { IndexBar, List, SearchBar } from 'antd-mobile'
import { componentsByLang } from '../../plugin-gallery/use-gallery-state'
import styles from '../../plugin-gallery/gallery.less'
import { useTikTokContext } from './TikTokProvider'

interface Props {
  goToComponent: (key: string) => void
  toDemoPaths: Record<string, string[]>
}

export const TikTokSearch = ({ goToComponent, toDemoPaths }: Props) => {
  const { lang } = useTikTokContext()
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
