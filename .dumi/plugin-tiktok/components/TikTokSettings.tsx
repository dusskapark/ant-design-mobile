import React, { useState } from 'react'
import { Image, List, Picker, Switch } from 'antd-mobile'
import { type Lang } from '../../plugin-gallery/use-gallery-state'
import { useTikTokContext } from './TikTokProvider'

export const TikTokSettings = () => {
  const { lang, setLang, isDark, toggleTheme, profile, ttVersion, isInApp } =
    useTikTokContext()
  const [pickerVisible, setPickerVisible] = useState(false)
  const langLabel = lang === 'en' ? 'English' : '中文'

  return (
    <>
      {profile && (
        <List header='Profile'>
          {profile.avatarUrl && (
            <List.Item
              prefix={
                <Image
                  src={profile.avatarUrl}
                  width={40}
                  height={40}
                  style={{ borderRadius: '50%' }}
                  fit='cover'
                />
              }
            >
              {profile.nickName}
            </List.Item>
          )}
          {!profile.avatarUrl && (
            <List.Item
              extra={<span style={{ color: '#888' }}>{profile.nickName}</span>}
            >
              Nickname
            </List.Item>
          )}
          {profile.openId && (
            <List.Item
              extra={
                <span style={{ color: '#888', fontSize: 12 }}>
                  {profile.openId}
                </span>
              }
            >
              Open ID
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
        {ttVersion && (
          <List.Item extra={<span style={{ color: '#888' }}>{ttVersion}</span>}>
            TikTok SDK
          </List.Item>
        )}
        <List.Item
          extra={
            <span style={{ color: '#888' }}>
              {isInApp ? 'In-App' : 'Browser'}
            </span>
          }
        >
          Platform
        </List.Item>
        <List.Item
          extra={<span style={{ color: '#888' }}>›</span>}
          onClick={() => (window.location.href = '/privacy-policy')}
        >
          Privacy Policy
        </List.Item>
        <List.Item
          extra={<span style={{ color: '#888' }}>›</span>}
          onClick={() => (window.location.href = '/terms')}
        >
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
