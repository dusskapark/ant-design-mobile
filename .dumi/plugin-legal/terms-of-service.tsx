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
      Terms of Service
    </NavBar>
    <div style={s.body}>
      <p style={s.meta}>
        <em>Last updated: March 2025</em>
      </p>

      <h4 style={s.h4}>1. Purpose</h4>
      <p style={s.p}>
        This app is a <strong>developer and designer tool</strong> for exploring
        and sharing antd-mobile UI components in a mobile environment. It is not
        intended for end users or production deployments.
      </p>

      <h4 style={s.h4}>2. Permitted Use</h4>
      <ul style={s.ul}>
        <li>Exploring antd-mobile components and demos</li>
        <li>Sharing component demos with teammates via LINE or TikTok</li>
        <li>Testing component behavior in a real mobile environment</li>
      </ul>

      <h4 style={s.h4}>3. Restrictions</h4>
      <ul style={s.ul}>
        <li>Do not use this app in a production environment</li>
        <li>Do not distribute or republish this app commercially</li>
        <li>Do not attempt to reverse-engineer or modify the service</li>
      </ul>

      <h4 style={s.h4}>4. Disclaimer</h4>
      <p style={s.p}>
        This app is provided <strong>"as-is"</strong> without warranties of any
        kind. The developer is not responsible for any issues arising from use
        of this app. Component demos are sourced from the open-source
        antd-mobile library (MIT License).
      </p>

      <h4 style={s.h4}>5. Open Source</h4>
      <p style={{ ...s.p, marginBottom: 0 }}>
        This playground is built on <strong>antd-mobile</strong> (MIT License).
        The underlying component library is open source and maintained by its
        contributors.
      </p>
    </div>
  </div>
)
