import { componentsByLang } from '../plugin-gallery/use-gallery-state'

const LIFF_ID = process.env.UMI_APP_LIFF_ID || ''

const CATEGORY_COLORS: Record<string, string> = {
  Common: '#1677FF',
  Layout: '#52C41A',
  Navigation: '#722ED1',
  'Data Display': '#FA8C16',
  'Data Entry': '#13C2C2',
  Feedback: '#F5222D',
  Guidance: '#EB2F96',
}
const DEFAULT_COLOR = '#8C8C8C'

export function getCategoryColor(componentKey: string): string {
  for (const group of componentsByLang['en']) {
    const found = group.children.find(
      item => item.path.split('/').pop() === componentKey
    )
    if (found) return CATEGORY_COLORS[group.title] ?? DEFAULT_COLOR
  }
  return DEFAULT_COLOR
}

export function getCategoryName(componentKey: string): string {
  for (const group of componentsByLang['en']) {
    const found = group.children.find(
      item => item.path.split('/').pop() === componentKey
    )
    if (found) return group.title
  }
  return 'Other'
}

export function buildFlexCarousel(
  title: string,
  componentKey: string,
  demoPaths: string[]
) {
  const color = getCategoryColor(componentKey)
  const category = getCategoryName(componentKey)
  const total = demoPaths.length

  // LIFF URL에 component 쿼리 파라미터를 붙여서 딥링크
  // liff-gallery.tsx에서 init 완료 후 해당 파라미터를 읽어 컴포넌트로 이동
  const liffUrl = `https://liff.line.me/${LIFF_ID}?component=${componentKey}`

  const bubbles = demoPaths.slice(0, 12).map((_, i) => ({
    type: 'bubble' as const,
    size: 'kilo' as const,
    hero: {
      type: 'box' as const,
      layout: 'vertical' as const,
      backgroundColor: color,
      height: '100px',
      justifyContent: 'center' as const,
      alignItems: 'center' as const,
      contents: [
        {
          type: 'text' as const,
          text: title[0].toUpperCase(),
          color: '#FFFFFF',
          size: '3xl' as const,
          weight: 'bold' as const,
          align: 'center' as const,
        },
        {
          type: 'text' as const,
          text: category,
          color: '#FFFFFF',
          size: 'xs' as const,
          align: 'center' as const,
        },
      ],
    },
    body: {
      type: 'box' as const,
      layout: 'vertical' as const,
      spacing: 'sm' as const,
      contents: [
        {
          type: 'text' as const,
          text: title,
          weight: 'bold' as const,
          size: 'md' as const,
        },
        {
          type: 'text' as const,
          text: `Demo ${i + 1} / ${total}`,
          size: 'sm' as const,
          color: '#888888',
        },
      ],
    },
    footer: {
      type: 'box' as const,
      layout: 'vertical' as const,
      contents: [
        {
          type: 'button' as const,
          style: 'primary' as const,
          color: '#06C755',
          action: {
            type: 'uri' as const,
            label: `Open Demo ${i + 1}`,
            uri: liffUrl,
          },
        },
      ],
    },
  }))

  return {
    type: 'flex' as const,
    altText: `${title} — ${total} demo${total > 1 ? 's' : ''}`,
    contents: {
      type: 'carousel' as const,
      contents: bubbles,
    },
  }
}
