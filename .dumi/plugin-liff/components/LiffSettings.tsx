import React, { useState } from 'react'
import { List, Picker, Switch } from 'antd-mobile'
import { type Lang } from '../../plugin-gallery/use-gallery-state'
import { useLiffContext } from './LiffProvider'

export const LiffSettings = () => {
  const { lang, setLang, isDark, toggleTheme } = useLiffContext()
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
