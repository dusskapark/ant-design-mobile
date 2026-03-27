import React from 'react'
import { NavBar } from 'antd-mobile'
import { LeftOutlined } from '@ant-design/icons'

const s: Record<string, React.CSSProperties> = {
  page: { maxWidth: 640, margin: '0 auto', fontFamily: 'sans-serif' },
  body: {
    padding: '16px 20px 40px',
    fontSize: 14,
    lineHeight: '1.7',
    color: '#333',
  },
  h4: { margin: '20px 0 6px', fontSize: 15, fontWeight: 600 },
  p: { margin: '0 0 12px' },
  ul: { margin: '0 0 12px', paddingLeft: 22 },
  meta: { margin: '0 0 20px', color: '#888', fontSize: 13 },
}

export default () => (
  <div style={s.page}>
    <NavBar backIcon={<LeftOutlined />} onBack={() => history.back()}>
      Privacy Policy
    </NavBar>
    <div style={s.body}>
      <p style={s.meta}>
        <em>Last updated: March 2025</em>
      </p>

      <h4 style={s.h4}>About This App</h4>
      <p style={s.p}>
        This is a mobile component playground for <strong>antd-mobile</strong>,
        a React UI library. It is intended for developers and designers to
        explore UI components and share them with teammates. It is not a
        commercial product and does not collect personal data for any business
        purpose.
      </p>

      <h4 style={s.h4}>Data We Access</h4>
      <p style={{ ...s.p, marginBottom: 4 }}>
        This app only accesses data when you authenticate through a supported
        platform (LINE or TikTok):
      </p>
      <ul style={s.ul}>
        <li>Display name or nickname</li>
        <li>Profile picture / avatar</li>
        <li>Platform user ID (shown in Settings for reference)</li>
      </ul>

      <h4 style={s.h4}>LINE LIFF Data</h4>
      <p style={s.p}>
        When accessed via LINE LIFF, we receive your LINE profile (display name,
        profile picture, user ID) through LINE Login. This data is displayed on
        the Settings screen only.
      </p>

      <h4 style={s.h4}>TikTok Data</h4>
      <p style={s.p}>
        When accessed via TikTok Mini App, we receive your TikTok profile
        (nickname, avatar) through TikTok Login. This data is displayed on the
        Settings screen only.
      </p>

      <h4 style={s.h4}>How We Use Your Data</h4>
      <ul style={s.ul}>
        <li>Displayed on the Settings screen during your session only</li>
        <li>Not stored on any server or database</li>
        <li>Not used for analytics, advertising, or tracking</li>
        <li>Not shared with any third party</li>
      </ul>

      <h4 style={s.h4}>Sharing Features</h4>
      <p style={s.p}>
        When you use the Share button, a link to the selected component demo is
        sent via the platform's native sharing mechanism (LINE message or TikTok
        share). No personal data is included in the shared content beyond the
        component URL.
      </p>

      <h4 style={s.h4}>Contact</h4>
      <p style={{ ...s.p, marginBottom: 0 }}>
        This is an internal developer tool. For questions, contact the developer
        who shared this app with you.
      </p>
    </div>
  </div>
)
