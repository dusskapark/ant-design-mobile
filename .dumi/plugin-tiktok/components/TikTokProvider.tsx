import React, { createContext, useContext, useEffect } from 'react'
import { setDefaultConfig } from 'antd-mobile'
import enUS from 'antd-mobile/es/locales/en-US'
import zhCN from 'antd-mobile/es/locales/zh-CN'
import { type Lang } from '../../plugin-gallery/use-gallery-state'

export interface TikTokProfile {
  nickName: string
  avatarUrl?: string
  openId?: string
}

interface TikTokContextValue {
  lang: Lang
  setLang: (l: Lang) => void
  isDark: boolean
  toggleTheme: () => void
  profile: TikTokProfile | null
  ttVersion: string | null
  isInApp: boolean
}

const TikTokContext = createContext<TikTokContextValue>(null!)

export const useTikTokContext = () => useContext(TikTokContext)

interface Props extends TikTokContextValue {
  children: React.ReactNode
}

export const TikTokProvider = ({
  lang,
  setLang,
  isDark,
  toggleTheme,
  profile,
  ttVersion,
  isInApp,
  children,
}: Props) => {
  useEffect(() => {
    setDefaultConfig({ locale: lang === 'zh' ? zhCN : enUS })
  }, [lang])

  return (
    <TikTokContext.Provider
      value={{
        lang,
        setLang,
        isDark,
        toggleTheme,
        profile,
        ttVersion,
        isInApp,
      }}
    >
      {children}
    </TikTokContext.Provider>
  )
}
