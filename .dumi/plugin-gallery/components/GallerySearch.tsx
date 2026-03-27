import React, { useMemo, useState } from 'react'
import { IndexBar, List, SearchBar } from 'antd-mobile'
import { componentsByLang, type Lang } from '../use-gallery-state'
import styles from '../gallery.less'

interface Props {
  goToComponent: (key: string) => void
  toDemoPaths: Record<string, string[]>
  lang: Lang
  searchPlaceholder: string
}

export const GallerySearch = ({
  goToComponent,
  toDemoPaths,
  lang,
  searchPlaceholder,
}: Props) => {
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
          placeholder={searchPlaceholder}
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
