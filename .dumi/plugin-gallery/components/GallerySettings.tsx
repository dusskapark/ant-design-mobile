import React, { useState } from 'react'
import { List, Picker, Switch } from 'antd-mobile'
import { type Lang } from '../use-gallery-state'
import { PrivacyPolicy } from './PrivacyPolicy'
import { TermsOfService } from './TermsOfService'

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
  const [ppVisible, setPpVisible] = useState(false)
  const [tosVisible, setTosVisible] = useState(false)
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
        <List.Item
          extra={<span style={{ color: '#888' }}>›</span>}
          onClick={() => setPpVisible(true)}
        >
          Privacy Policy
        </List.Item>
        <List.Item
          extra={<span style={{ color: '#888' }}>›</span>}
          onClick={() => setTosVisible(true)}
        >
          Terms of Service
        </List.Item>
      </List>
      <PrivacyPolicy
        visible={ppVisible}
        onClose={() => setPpVisible(false)}
        platform='web'
      />
      <TermsOfService
        visible={tosVisible}
        onClose={() => setTosVisible(false)}
      />
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
