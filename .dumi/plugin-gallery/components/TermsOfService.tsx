import React from 'react'
import { Modal } from 'antd-mobile'

interface Props {
  visible: boolean
  onClose: () => void
}

export const TermsOfService = ({ visible, onClose }: Props) => (
  <Modal
    visible={visible}
    onClose={onClose}
    closeOnMaskClick
    title='Terms of Service'
    content={
      <div style={{ fontSize: 13, lineHeight: '1.6', color: '#555' }}>
        <p style={{ margin: '0 0 12px' }}>
          <em>Last updated: March 2025</em>
        </p>

        <h4 style={{ margin: '0 0 6px' }}>1. Purpose</h4>
        <p style={{ margin: '0 0 12px' }}>
          This app is a <strong>developer and designer tool</strong> for
          exploring and sharing antd-mobile UI components in a mobile
          environment. It is not intended for end users or production
          deployments.
        </p>

        <h4 style={{ margin: '0 0 6px' }}>2. Permitted Use</h4>
        <ul style={{ margin: '0 0 12px', paddingLeft: 20 }}>
          <li>Exploring antd-mobile components and demos</li>
          <li>Sharing component demos with teammates via LINE or TikTok</li>
          <li>Testing component behavior in a real mobile environment</li>
        </ul>

        <h4 style={{ margin: '0 0 6px' }}>3. Restrictions</h4>
        <ul style={{ margin: '0 0 12px', paddingLeft: 20 }}>
          <li>Do not use this app in a production environment</li>
          <li>Do not distribute or republish this app commercially</li>
          <li>Do not attempt to reverse-engineer or modify the service</li>
        </ul>

        <h4 style={{ margin: '0 0 6px' }}>4. Disclaimer</h4>
        <p style={{ margin: '0 0 12px' }}>
          This app is provided <strong>"as-is"</strong> without warranties of
          any kind. The developer is not responsible for any issues arising from
          use of this app. Component demos are sourced from the open-source
          antd-mobile library (MIT License).
        </p>

        <h4 style={{ margin: '0 0 6px' }}>5. Open Source</h4>
        <p style={{ margin: 0 }}>
          This playground is built on <strong>antd-mobile</strong> (MIT
          License). The underlying component library is open source and
          maintained by its contributors.
        </p>
      </div>
    }
    actions={[{ key: 'close', text: 'Close', onClick: onClose }]}
  />
)
