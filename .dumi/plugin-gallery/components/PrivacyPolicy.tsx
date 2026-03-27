import React from 'react'
import { Modal } from 'antd-mobile'

interface Props {
  visible: boolean
  onClose: () => void
  platform?: 'web' | 'liff' | 'tiktok'
}

export const PrivacyPolicy = ({
  visible,
  onClose,
  platform = 'web',
}: Props) => {
  const platformSection = platform !== 'web' && (
    <>
      <h4 style={{ margin: '16px 0 6px' }}>
        {platform === 'liff' ? 'LINE LIFF' : 'TikTok'} Data
      </h4>
      <p>
        {platform === 'liff'
          ? 'When accessed via LINE LIFF, we receive your LINE profile (display name, profile picture, user ID) through LINE Login. This data is displayed on the Settings screen only.'
          : 'When accessed via TikTok Mini App, we receive your TikTok profile (nickname, avatar) through TikTok Login. This data is displayed on the Settings screen only.'}
      </p>
    </>
  )

  return (
    <Modal
      visible={visible}
      onClose={onClose}
      closeOnMaskClick
      title='Privacy Policy'
      content={
        <div style={{ fontSize: 13, lineHeight: '1.6', color: '#555' }}>
          <p style={{ margin: '0 0 12px' }}>
            <em>Last updated: March 2025</em>
          </p>

          <h4 style={{ margin: '0 0 6px' }}>About This App</h4>
          <p style={{ margin: '0 0 12px' }}>
            This is a mobile component playground for{' '}
            <strong>antd-mobile</strong>, a React UI library. It is intended for
            developers and designers to explore UI components and share them
            with teammates. It is not a commercial product and does not collect
            personal data for any business purpose.
          </p>

          <h4 style={{ margin: '0 0 6px' }}>Data We Access</h4>
          <p style={{ margin: '0 0 4px' }}>
            This app only accesses data when you authenticate through a
            supported platform (LINE or TikTok):
          </p>
          <ul style={{ margin: '0 0 12px', paddingLeft: 20 }}>
            <li>Display name or nickname</li>
            <li>Profile picture / avatar</li>
            <li>Platform user ID (shown in Settings for reference)</li>
          </ul>

          {platformSection}

          <h4 style={{ margin: '16px 0 6px' }}>How We Use Your Data</h4>
          <ul style={{ margin: '0 0 12px', paddingLeft: 20 }}>
            <li>Displayed on the Settings screen during your session only</li>
            <li>Not stored on any server or database</li>
            <li>Not used for analytics, advertising, or tracking</li>
            <li>Not shared with any third party</li>
          </ul>

          <h4 style={{ margin: '0 0 6px' }}>Sharing Features</h4>
          <p style={{ margin: '0 0 12px' }}>
            When you use the Share button, a link to the selected component demo
            is sent via the platform's native sharing mechanism (LINE message or
            TikTok share). No personal data is included in the shared content
            beyond the component URL.
          </p>

          <h4 style={{ margin: '0 0 6px' }}>Contact</h4>
          <p style={{ margin: 0 }}>
            This is an internal developer tool. For questions, contact the
            developer who shared this app with you.
          </p>
        </div>
      }
      actions={[{ key: 'close', text: 'Close', onClick: onClose }]}
    />
  )
}
