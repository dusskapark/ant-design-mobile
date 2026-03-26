import React, { createContext, useContext } from 'react'
import { ConfigProvider } from 'antd-mobile'
import enUS from 'antd-mobile/es/locales/en-US'
import zhCN from 'antd-mobile/es/locales/zh-CN'
import { type Lang } from '../../plugin-gallery/use-gallery-state'

interface LiffContextValue {
  lang: Lang
  setLang: (l: Lang) => void
  isDark: boolean
  toggleTheme: () => void
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
  children,
}: Props) => {
  const locale = lang === 'en' ? enUS : zhCN
  return (
    <LiffContext.Provider value={{ lang, setLang, isDark, toggleTheme }}>
      <ConfigProvider locale={locale}>{children}</ConfigProvider>
    </LiffContext.Provider>
  )
}
