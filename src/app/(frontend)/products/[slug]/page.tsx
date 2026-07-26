import type { Metadata } from 'next'

import configPromise from '@payload-config'
import { ArrowLeft, BadgeCheck, Banknote, Truck } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import React from 'react'

import type { Media as MediaType, StoreSetting } from '@/payload-types'

import { CODOrderForm } from '@/components/CODOrderForm'
import { ProductGallery } from '@/components/ProductGallery'
import { WhatsAppIcon } from '@/components/store/WhatsAppIcon'
import { getCachedGlobal } from '@/utilities/getGlobals'
import { getServerSideURL } from '@/utilities/getURL'

export const revalidate = 600

const conditionLabels: Record<string, string> = {
  'new-with-tags': 'New with tags',
  'like-new': 'Like new',
  good: 'Good',
  fair: 'Fair',
}

type Args = {
  params: Promise<{ slug: string }>
}

async function queryProduct(slug: string) {
  const payload = await getPayload({ config: configPromise })

  const [{ docs }, settings] = await Promise.all([
    payload.find({
      collection: 'products',
      depth: 1,
      limit: 1,
      where: { slug: { equals: slug } },
    }),
    getCachedGlobal('store-settings', 0)() as Promise<StoreSetting>,
  ])

  return { product: docs[0] ?? null, settings }
}

export async function generateMetadata({ params }: Args): Promise<Metadata> {
  const { slug } = await params
  const { product } = await queryProduct(slug)
  if (!product) return { title: 'Not found' }

  const cover = Array.isArray(product.photos) ? product.photos[0] : null
  const ogImage =
    cover && typeof cover === 'object' && cover.url ? `${getServerSideURL()}${cover.url}` : undefined

  return {
    title: `${product.title} — PKR ${product.price.toLocaleString('en-PK')}`,
    description: product.description ?? `PKR ${product.price} — one piece only.`,
    openGraph: {
      title: product.title,
      images: ogImage ? [{ url: ogImage }] : undefined,
    },
  }
}

export default async function ProductPage({ params }: Args) {
  const { slug } = await params
  const { product, settings } = await queryProduct(slug)

  if (!product || product.hidden) notFound()

  const photos = (Array.isArray(product.photos) ? product.photos : []).filter(
    (p): p is MediaType => typeof p === 'object' && p !== null,
  )
  const video = typeof product.video === 'object' ? product.video : null

  const discount =
    typeof product.originalPrice === 'number' && product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : null

  const productUrl = `${getServerSideURL()}/products/${product.slug}`
  const waNumber = (settings?.whatsappNumber ?? '').replace(/[^\d]/g, '')
  const waText = encodeURIComponent(
    `Assalam o Alaikum! I want to buy this article:\n\n*${product.title}*\nPrice: PKR ${product.price.toLocaleString('en-PK')}${product.size ? `\nSize: ${product.size}` : ''}\n\n${productUrl}`,
  )
  const waHref = `https://wa.me/${waNumber}?text=${waText}`
  const deliveryCharge = typeof settings?.deliveryCharge === 'number' ? settings.deliveryCharge : 300

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    description: product.description ?? undefined,
    image: photos
      .map((p) => (p.url ? `${getServerSideURL()}${p.url}` : null))
      .filter(Boolean),
    itemCondition: 'https://schema.org/UsedCondition',
    offers: {
      '@type': 'Offer',
      url: productUrl,
      price: product.price,
      priceCurrency: 'PKR',
      availability: product.sold
        ? 'https://schema.org/SoldOut'
        : 'https://schema.org/InStock',
      itemOffered: { '@type': 'Product', name: product.title },
      areaServed: { '@type': 'Country', name: 'Pakistan' },
      eligibleRegion: { '@type': 'Country', name: 'PK' },
    },
  }

  return (
    <div className="container pb-28 pt-6 lg:py-12">
      <script
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        type="application/ld+json"
      />
      <Link
        className="mb-6 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground transition-colors hover:text-foreground"
        href="/#new-drops"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> Back to drops
      </Link>

      <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:gap-16">
        <ProductGallery photos={photos} video={video} />

        <div className="lg:sticky lg:top-32 lg:self-start">
          <div className="flex flex-wrap items-center gap-2">
            {product.sold ? (
              <span className="border border-foreground px-3 py-1 text-[10px] font-bold uppercase tracking-[0.25em]">
                Sold
              </span>
            ) : (
              <span className="bg-foreground px-3 py-1 text-[10px] font-bold uppercase tracking-[0.25em] text-background">
                1 of 1
              </span>
            )}
            {discount !== null && !product.sold && (
              <span className="bg-red-600 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.25em] text-white">
                -{discount}%
              </span>
            )}
          </div>

          <h1 className="font-display mt-4 text-3xl font-black uppercase tracking-tight lg:text-4xl">
            {product.title}
          </h1>

          <p className="mt-4 flex items-baseline gap-3">
            <span className="text-2xl font-bold">
              PKR {product.price.toLocaleString('en-PK')}
            </span>
            {discount !== null && (
              <span className="text-base text-muted-foreground line-through">
                PKR {product.originalPrice?.toLocaleString('en-PK')}
              </span>
            )}
          </p>

          <dl className="mt-6 grid grid-cols-2 gap-px overflow-hidden border border-border bg-border text-sm">
            {product.condition && (
              <div className="bg-background p-3">
                <dt className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                  Condition
                </dt>
                <dd className="mt-1 font-medium">
                  {conditionLabels[product.condition] ?? product.condition}
                </dd>
              </div>
            )}
            {product.size && (
              <div className="bg-background p-3">
                <dt className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                  Size
                </dt>
                <dd className="mt-1 font-medium">{product.size}</dd>
              </div>
            )}
          </dl>

          {product.description && (
            <p className="mt-6 whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
              {product.description}
            </p>
          )}

          {product.sold ? (
            <div className="mt-8 border border-border bg-muted/40 p-5 text-center">
              <p className="text-sm font-bold uppercase tracking-[0.2em]">
                This piece has been sold
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                Follow the drops — the next find won&apos;t wait either.
              </p>
              <Link
                className="mt-4 inline-block bg-foreground px-6 py-3 text-xs font-bold uppercase tracking-[0.15em] text-background transition-opacity hover:opacity-85"
                href="/#new-drops"
              >
                Shop available pieces
              </Link>
            </div>
          ) : (
            <>
              <a
                className="mt-8 flex w-full items-center justify-center gap-3 bg-[#25D366] px-6 py-4 text-sm font-bold uppercase tracking-[0.15em] text-white transition-opacity hover:opacity-90"
                href={waHref}
                rel="noopener noreferrer"
                target="_blank"
              >
                <WhatsAppIcon className="h-5 w-5" /> Chat to Buy on WhatsApp
              </a>

              {settings?.codAvailable && (
                <CODOrderForm
                  deliveryCharge={deliveryCharge}
                  price={product.price}
                  productId={product.id}
                  productTitle={product.title}
                  productUrl={productUrl}
                  whatsappNumber={waNumber}
                />
              )}

              <div className="mt-6 space-y-3 border border-border p-5 text-sm">
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                  Payment &amp; delivery
                </p>
                {settings?.easypaisaNumber && (
                  <p className="flex items-start gap-3">
                    <Banknote className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={1.5} />
                    <span>
                      <span className="font-semibold">EasyPaisa:</span> {settings.easypaisaNumber}
                      {settings.easypaisaName ? ` (${settings.easypaisaName})` : ''}
                    </span>
                  </p>
                )}
                {settings?.codAvailable && (
                  <p className="flex items-start gap-3">
                    <Truck className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={1.5} />
                    <span>
                      <span className="font-semibold">Cash on Delivery</span> — all over Pakistan
                      (deliveries within Pakistan only)
                    </span>
                  </p>
                )}
                <p className="flex items-start gap-3">
                  <BadgeCheck className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={1.5} />
                  <span>Order confirmed personally on WhatsApp.</span>
                </p>
                {settings?.paymentNote && (
                  <p className="border-t border-border pt-3 text-muted-foreground">
                    {settings.paymentNote}
                  </p>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Sticky mobile buy bar */}
      {!product.sold && (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 px-4 pt-3 backdrop-blur-md [padding-bottom:calc(0.75rem+env(safe-area-inset-bottom))] lg:hidden">
          <div className="flex items-center gap-3">
            <div className="min-w-0">
              <p className="truncate text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                {product.title}
              </p>
              <p className="text-base font-bold">PKR {product.price.toLocaleString('en-PK')}</p>
            </div>
            <a
              className="ml-auto flex min-h-12 shrink-0 items-center justify-center gap-2 bg-[#25D366] px-5 text-sm font-bold uppercase tracking-wide text-white transition-transform active:scale-[0.98]"
              href={waHref}
              rel="noopener noreferrer"
              target="_blank"
            >
              <WhatsAppIcon className="h-5 w-5" /> Chat to Buy
            </a>
          </div>
        </div>
      )}
    </div>
  )
}
