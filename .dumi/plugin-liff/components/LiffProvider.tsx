import React, { createContext, useContext } from 'react'
import { ConfigProvider } from 'antd-mobile'
import enUS from 'antd-mobile/es/locales/en-US'
import zhCN from 'antd-mobile/es/locales/zh-CN'
import { type Lang } from '../../plugin-gallery/use-gallery-state'

export interface LiffProfile {
  userId: string
  displayName: string
  pictureUrl?: string
  statusMessage?: string
}

interface LiffContextValue {
  lang: Lang
  setLang: (l: Lang) => void
  isDark: boolean
  toggleTheme: () => void
  profile: LiffProfile | null
  liffVersion: string | null
  lineVersion: string | null
}

const LiffContext = createContext<LiffContextValue>(null!)

export const useLiffContext = () => useContext(LiffContext)

interface Props extends LiffContextValue {
  children: React.ReactNode
}

export const LiffProvider = ({
  lang,
  setLang,
  isDark,
  toggleTheme,
  profile,
  liffVersion,
  lineVersion,
  children,
}: Props) => {
  const locale = lang === 'en' ? enUS : zhCN
  return (
    <LiffContext.Provider
      value={{
        lang,
        setLang,
        isDark,
        toggleTheme,
        profile,
        liffVersion,
        lineVersion,
      }}
    >
      <ConfigProvider locale={locale}>{children}</ConfigProvider>
    </LiffContext.Provider>
  )
}
