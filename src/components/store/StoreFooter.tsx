import Link from 'next/link'
import React from 'react'

import type { StoreSetting } from '@/payload-types'

import { getCachedGlobal } from '@/utilities/getGlobals'

import { WhatsAppIcon } from './WhatsAppIcon'

export async function StoreFooter() {
  const settings = (await getCachedGlobal('store-settings', 0)()) as StoreSetting
  const waNumber = (settings?.whatsappNumber ?? '').replace(/[^\d]/g, '')

  return (
    <footer className="mt-auto bg-[#241b12] text-[#f2ead9]">
      <div className="container py-14">
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          <div className="max-w-sm">
            <p className="font-display text-3xl font-black uppercase tracking-tight">
              {settings?.storeName ?? 'THRIFTED.'}
            </p>
            {settings?.tagline && <p className="mt-3 text-sm text-white/60">{settings.tagline}</p>}
          </div>
          <div className="grid grid-cols-2 gap-10 text-sm">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/50">Shop</p>
              <ul className="mt-4 space-y-2">
                <li>
                  <Link className="text-white/80 transition-colors hover:text-white" href="/#new-drops">
                    New Drops
                  </Link>
                </li>
                <li>
                  <Link
                    className="text-white/80 transition-colors hover:text-white"
                    href="/#how-to-order"
                  >
                    How to Order
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/50">
                Contact
              </p>
              <ul className="mt-4 space-y-2">
                {waNumber && (
                  <li>
                    <a
                      className="inline-flex items-center gap-2 text-white/80 transition-colors hover:text-white"
                      href={`https://wa.me/${waNumber}`}
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      <WhatsAppIcon className="h-4 w-4" /> WhatsApp
                    </a>
                  </li>
                )}
                {settings?.instagramUrl && (
                  <li>
                    <a
                      className="text-white/80 transition-colors hover:text-white"
                      href={settings.instagramUrl}
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      Instagram
                    </a>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-12 flex items-center gap-4 text-white/30">
          <span className="h-px flex-1 bg-white/10" />
          <span className="font-display text-xs uppercase tracking-[0.4em]">
            Est. 2026 · Pakistan
          </span>
          <span className="h-px flex-1 bg-white/10" />
        </div>
        <div className="mt-6 flex flex-col gap-2 border-t border-white/10 pt-6 text-xs text-white/40 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {settings?.storeName ?? 'THRIFTED.'} — every piece is 1 of
            1.
          </p>
          <p>COD &amp; EasyPaisa accepted. We deliver within Pakistan only.</p>
        </div>
      </div>
    </footer>
  )
}
