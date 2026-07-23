import Link from 'next/link'
import React from 'react'

import type { StoreSetting } from '@/payload-types'

import { getCachedGlobal } from '@/utilities/getGlobals'

import { AnnouncementBar } from './AnnouncementBar'
import { WhatsAppIcon } from './WhatsAppIcon'

export async function StoreHeader() {
  const settings = (await getCachedGlobal('store-settings', 0)()) as StoreSetting

  const waNumber = (settings?.whatsappNumber ?? '').replace(/[^\d]/g, '')

  return (
    <header className="sticky top-0 z-40">
      <AnnouncementBar text={settings?.announcementText} />
      <div className="border-b border-border bg-background/90 backdrop-blur-md">
        <div className="container flex h-14 items-center justify-between sm:h-16">
          <Link
            className="font-display text-xl font-black uppercase tracking-tight sm:text-2xl"
            href="/"
          >
            {settings?.storeName ?? 'THRIFTED.'}
          </Link>
          <nav className="flex items-center gap-3 sm:gap-6">
            <Link
              className="px-1 py-3 text-[10px] font-semibold uppercase tracking-[0.12em] transition-colors hover:text-muted-foreground sm:text-xs sm:tracking-[0.15em]"
              href="/#new-drops"
            >
              New Drops
            </Link>
            <Link
              className="px-1 py-3 text-[10px] font-semibold uppercase tracking-[0.12em] transition-colors hover:text-muted-foreground sm:text-xs sm:tracking-[0.15em]"
              href="/#how-to-order"
            >
              How to Order
            </Link>
            {waNumber && (
              <a
                aria-label="Chat on WhatsApp"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-[#25D366] text-white transition-transform hover:scale-105"
                href={`https://wa.me/${waNumber}`}
                rel="noopener noreferrer"
                target="_blank"
              >
                <WhatsAppIcon className="h-5 w-5" />
              </a>
            )}
          </nav>
        </div>
      </div>
    </header>
  )
}
