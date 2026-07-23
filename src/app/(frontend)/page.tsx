import type { Metadata } from 'next'

import configPromise from '@payload-config'
import { ArrowRight, BadgeCheck, Banknote, Truck } from 'lucide-react'
import Link from 'next/link'
import { getPayload } from 'payload'
import React from 'react'

import type { StoreSetting } from '@/payload-types'

import { Media } from '@/components/Media'
import { ProductCard } from '@/components/ProductCard'
import { Reveal } from '@/components/store/Reveal'
import { WhatsAppIcon } from '@/components/store/WhatsAppIcon'
import { getCachedGlobal } from '@/utilities/getGlobals'

export const revalidate = 600

export const metadata: Metadata = {
  title: 'New Drops — 1 of 1 Vintage & Thrift Finds',
  description:
    'Curated pre-loved fashion, delivered within Pakistan only. Every article is a single piece — order on WhatsApp, pay by EasyPaisa or Cash on Delivery.',
}

const usps = [
  {
    icon: Truck,
    title: 'COD — Pakistan Only',
    text: 'Cash on Delivery across Pakistan. We deliver within Pakistan only.',
  },
  {
    icon: Banknote,
    title: 'EasyPaisa Accepted',
    text: 'Pay by EasyPaisa, confirm with a screenshot on WhatsApp.',
  },
  {
    icon: BadgeCheck,
    title: 'Every Piece Is 1 of 1',
    text: 'Hand-picked singles. Once sold, gone forever.',
  },
]

const Eyebrow: React.FC<{ children: React.ReactNode; light?: boolean }> = ({
  children,
  light,
}) => (
  <p
    className={`flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.3em] sm:text-xs ${
      light ? 'text-white/70' : 'text-muted-foreground'
    }`}
  >
    <span className={`h-px w-8 ${light ? 'bg-white/40' : 'bg-foreground/25'}`} />
    {children}
  </p>
)

export default async function ShopPage() {
  const payload = await getPayload({ config: configPromise })

  const [{ docs: products }, settings] = await Promise.all([
    payload.find({
      collection: 'products',
      depth: 1,
      limit: 100,
      sort: ['sold', '-createdAt'],
    }),
    getCachedGlobal('store-settings', 1)() as Promise<StoreSetting>,
  ])

  const available = products.filter((p) => !p.sold)
  const soldOut = products.filter((p) => p.sold)
  const waNumber = (settings?.whatsappNumber ?? '').replace(/[^\d]/g, '')

  const heroImage = typeof settings?.heroImage === 'object' ? settings.heroImage : null
  const heroImageAlt = typeof settings?.heroImageAlt === 'object' ? settings.heroImageAlt : null
  const lookbook = (Array.isArray(settings?.lookbookImages) ? settings.lookbookImages : []).filter(
    (img) => typeof img === 'object' && img !== null,
  )

  return (
    <div>
      {/* Hero */}
      <section
        className={`grain relative flex min-h-[62svh] items-end overflow-hidden border-b border-border lg:min-h-[80vh] ${
          heroImage ? '' : 'bg-muted/30'
        }`}
      >
        {heroImage && (
          <Media
            fill
            htmlElement={null}
            imgClassName="object-cover object-[center_18%]"
            priority
            resource={heroImage}
            size="100vw"
          />
        )}
        {heroImage && heroImageAlt && (
          <div className="hero-fade absolute inset-0">
            <Media
              fill
              htmlElement={null}
              imgClassName="object-cover object-[center_18%]"
              resource={heroImageAlt}
              size="100vw"
            />
          </div>
        )}
        {heroImage && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-black/10" />
        )}
        <div
          className={`container relative pb-10 pt-32 sm:pb-14 lg:pb-20 ${heroImage ? 'text-white' : ''}`}
        >
          <Reveal>
            <Eyebrow light={Boolean(heroImage)}>Curated pre-loved fashion — Pakistan</Eyebrow>
            <h1 className="font-display mt-4 max-w-3xl text-5xl font-black uppercase leading-[0.95] tracking-tight sm:text-7xl">
              One piece.
              <br />
              One <span className="italic">chance.</span>
            </h1>
            <p
              className={`mt-4 max-w-md text-sm sm:text-base ${
                heroImage ? 'text-white/80' : 'text-muted-foreground'
              }`}
            >
              {settings?.tagline ??
                'Hand-picked thrift finds in top condition. Every article is a single piece — when it sells, it is gone.'}
            </p>
            <div className="mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
              <Link
                className={`inline-flex min-h-12 items-center justify-center gap-2 px-8 py-3.5 text-sm font-bold uppercase tracking-[0.15em] transition-opacity hover:opacity-85 sm:py-4 ${
                  heroImage ? 'bg-white text-black' : 'bg-foreground text-background'
                }`}
                href="#new-drops"
              >
                Shop New Drops <ArrowRight className="h-4 w-4" />
              </Link>
              {waNumber && (
                <a
                  className={`inline-flex min-h-12 items-center justify-center gap-2 border px-8 py-3.5 text-sm font-bold uppercase tracking-[0.15em] transition-colors sm:py-4 ${
                    heroImage
                      ? 'border-white/40 text-white backdrop-blur-sm hover:bg-white/10'
                      : 'border-border hover:bg-muted'
                  }`}
                  href={`https://wa.me/${waNumber}`}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <WhatsAppIcon className="h-4 w-4" /> Chat With Us
                </a>
              )}
            </div>
          </Reveal>
        </div>
      </section>

      {/* USP strip */}
      <section className="border-b border-border bg-muted/40">
        <div className="container grid gap-8 py-10 sm:grid-cols-3">
          {usps.map(({ icon: Icon, title, text }, i) => (
            <Reveal delay={i * 0.08} key={title}>
              <div className="flex items-start gap-4">
                <Icon className="mt-0.5 h-6 w-6 shrink-0" strokeWidth={1.5} />
                <div>
                  <p className="text-sm font-bold uppercase tracking-wide">{title}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{text}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* New drops */}
      <section className="container scroll-mt-24 py-14 lg:py-20" id="new-drops">
        <Reveal className="mb-10">
          <Eyebrow>The current drop</Eyebrow>
          <h2 className="font-display mt-3 text-3xl font-black uppercase tracking-tight sm:text-4xl">
            New <span className="italic">Drops</span>
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Fresh finds, one piece each. Don&apos;t sleep on them.
          </p>
        </Reveal>
        {available.length === 0 ? (
          <p className="py-20 text-center text-muted-foreground">
            All sold out — new drop coming soon. Follow us on WhatsApp for first dibs.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4 lg:gap-x-6">
            {available.map((product, i) => (
              <Reveal delay={(i % 4) * 0.06} key={product.id}>
                <ProductCard priority={i < 4} product={product} />
              </Reveal>
            ))}
          </div>
        )}
      </section>

      {/* Lookbook */}
      {lookbook.length > 0 && (
        <section className="border-t border-border bg-muted/30">
          <div className="container py-14 lg:py-20">
            <Reveal className="mb-10">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <Eyebrow>Style notes</Eyebrow>
                  <h2 className="font-display mt-3 text-3xl font-black uppercase tracking-tight sm:text-4xl">
                    The <span className="italic">Edit</span>
                  </h2>
                  <p className="mt-2 text-sm text-muted-foreground">
                    The look we hunt for — timeless, tailored, built to last.
                  </p>
                </div>
                <Link
                  className="hidden shrink-0 items-center gap-2 text-xs font-bold uppercase tracking-[0.15em] underline-offset-4 hover:underline sm:inline-flex"
                  href="#new-drops"
                >
                  Shop the look <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </Reveal>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:gap-6">
              {lookbook.map((img, i) => (
                <Reveal
                  className={
                    i === 0
                      ? 'relative col-span-2 aspect-[4/3] overflow-hidden sm:col-span-1 sm:aspect-[3/4]'
                      : 'relative aspect-[3/4] overflow-hidden'
                  }
                  delay={i * 0.08}
                  key={typeof img === 'object' ? img.id : i}
                >
                  <Media
                    fill
                    htmlElement={null}
                    imgClassName="object-cover transition-transform duration-500 hover:scale-[1.03]"
                    resource={img}
                    size="(max-width: 640px) 100vw, 33vw"
                  />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* How to order */}
      <section
        className="grain scroll-mt-24 border-y border-border bg-[#241b12] text-[#f2ead9]"
        id="how-to-order"
      >
        <div className="container py-14 lg:py-20">
          <Reveal>
            <Eyebrow light>Simple as salaam</Eyebrow>
            <h2 className="font-display mt-3 text-3xl font-black uppercase tracking-tight sm:text-4xl">
              How to <span className="italic">Order</span>
            </h2>
          </Reveal>
          <div className="mt-10 grid gap-10 sm:grid-cols-3">
            {[
              {
                step: '01',
                title: 'Tap "Chat to Buy"',
                text: 'The article you want opens straight in our WhatsApp chat.',
              },
              {
                step: '02',
                title: 'Pay your way',
                text: `EasyPaisa${settings?.easypaisaNumber ? ` (${settings.easypaisaNumber})` : ''} with a screenshot — or simply choose Cash on Delivery.`,
              },
              {
                step: '03',
                title: 'Delivered to your door',
                text: 'We confirm on WhatsApp and ship anywhere in Pakistan. Deliveries within Pakistan only.',
              },
            ].map(({ step, title, text }, i) => (
              <Reveal delay={i * 0.1} key={step}>
                <p className="font-display text-5xl font-black text-white/20">{step}</p>
                <p className="mt-3 text-sm font-bold uppercase tracking-wide">{title}</p>
                <p className="mt-2 text-sm text-white/60">{text}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Floating WhatsApp bubble (mobile) */}
      {waNumber && (
        <a
          aria-label="Chat on WhatsApp"
          className="fixed bottom-5 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-black/25 transition-transform active:scale-95 lg:hidden"
          href={`https://wa.me/${waNumber}`}
          rel="noopener noreferrer"
          target="_blank"
        >
          <WhatsAppIcon className="h-7 w-7" />
        </a>
      )}

      {/* Recently sold */}
      {soldOut.length > 0 && (
        <section className="container py-14 lg:py-20">
          <Reveal>
            <Eyebrow>Sold archive</Eyebrow>
            <h2 className="font-display mt-3 text-2xl font-black uppercase tracking-tight sm:text-3xl">
              Gone <span className="italic">Already</span>
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Sold pieces — proof that good finds don&apos;t wait.
            </p>
          </Reveal>
          <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4 lg:gap-x-6">
            {soldOut.map((product, i) => (
              <Reveal delay={(i % 4) * 0.06} key={product.id}>
                <ProductCard product={product} />
              </Reveal>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
