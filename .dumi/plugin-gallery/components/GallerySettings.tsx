import React, { useState } from 'react'
import { List, Picker, Switch } from 'antd-mobile'
import { type Lang } from '../use-gallery-state'

interface Props {
  lang: Lang
  setLang: React.Dispatch<React.SetStateAction<Lang>>
  isDark: boolean
  toggleTheme: () => void
}

export const GallerySettings = ({
  lang,
  setLang,
  isDark,
  toggleTheme,
}: Props) => {
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
      <List header='About'>
        <List.Item
          extra={
            <span style={{ color: '#888' }}>
              {process.env.ANTD_MOBILE_VERSION}
            </span>
          }
        >
          antd-mobile
        </List.Item>
        <List.Item
          extra={<span style={{ color: '#888' }}>Web Application</span>}
        >
          Platform
        </List.Item>
        <List.Item onClick={() => (window.location.href = '/privacy-policy')}>
          Privacy Policy
        </List.Item>
        <List.Item onClick={() => (window.location.href = '/terms')}>
          Terms of Service
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
