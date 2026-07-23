import type { Metadata } from 'next'
import { getServerSideURL } from './getURL'

const defaultOpenGraph: Metadata['openGraph'] = {
  type: 'website',
  description:
    'Curated pre-loved fashion, one piece each. WhatsApp ordering, EasyPaisa & COD — delivered within Pakistan only.',
  images: [
    {
      url: `${getServerSideURL()}/og-default.jpg`,
    },
  ],
  locale: 'en_PK',
  siteName: 'THRIFTED.',
  title: 'THRIFTED. — One Piece. One Chance.',
}

export const mergeOpenGraph = (og?: Metadata['openGraph']): Metadata['openGraph'] => {
  return {
    ...defaultOpenGraph,
    ...og,
    images: og?.images ? og.images : defaultOpenGraph.images,
  }
}
