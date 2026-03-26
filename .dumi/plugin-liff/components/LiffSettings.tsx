import React, { useState } from 'react'
import { Image, List, Picker, Switch } from 'antd-mobile'
import { type Lang } from '../../plugin-gallery/use-gallery-state'
import { useLiffContext } from './LiffProvider'

export const LiffSettings = () => {
  const {
    lang,
    setLang,
    isDark,
    toggleTheme,
    profile,
    liffVersion,
    lineVersion,
  } = useLiffContext()
  const [pickerVisible, setPickerVisible] = useState(false)
  const langLabel = lang === 'en' ? 'English' : '中文'

  return (
    <>
      {profile && (
        <List header='Profile'>
          {profile.pictureUrl && (
            <List.Item
              prefix={
                <Image
                  src={profile.pictureUrl}
                  width={40}
                  height={40}
                  style={{ borderRadius: '50%' }}
                  fit='cover'
                />
              }
            >
              {profile.displayName}
            </List.Item>
          )}
          {!profile.pictureUrl && (
            <List.Item
              extra={
                <span style={{ color: '#888' }}>{profile.displayName}</span>
              }
            >
              Name
            </List.Item>
          )}
          <List.Item
            extra={
              <span style={{ color: '#888', fontSize: 12 }}>
                {profile.userId}
              </span>
            }
          >
            User ID
          </List.Item>
          {profile.statusMessage && (
            <List.Item
              extra={
                <span style={{ color: '#888' }}>{profile.statusMessage}</span>
              }
            >
              Status
            </List.Item>
          )}
        </List>
      )}
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
        <List.Item extra={<span style={{ color: '#888' }}>{liffVersion}</span>}>
          LIFF SDK
        </List.Item>
        <List.Item extra={<span style={{ color: '#888' }}>{lineVersion}</span>}>
          LINE
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
