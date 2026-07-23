import Link from 'next/link'
import React from 'react'

import type { Product } from '@/payload-types'

import { Media } from '@/components/Media'

const conditionLabels: Record<string, string> = {
  'new-with-tags': 'New with tags',
  'like-new': 'Like new',
  good: 'Good',
  fair: 'Fair',
}

export const ProductCard: React.FC<{ product: Product; priority?: boolean }> = ({
  product,
  priority,
}) => {
  const { slug, title, price, originalPrice, sold, size, condition } = product
  const photos = (Array.isArray(product.photos) ? product.photos : []).filter(
    (p) => typeof p === 'object' && p !== null,
  )
  const cover = photos[0]
  const hoverPhoto = photos[1]

  const discount =
    typeof originalPrice === 'number' && originalPrice > price
      ? Math.round(((originalPrice - price) / originalPrice) * 100)
      : null

  const subtitle = [condition ? conditionLabels[condition] : null, size ? `Size ${size}` : null]
    .filter(Boolean)
    .join(' | ')

  return (
    <Link className="group block" href={`/products/${slug}`}>
      <div className="relative aspect-[3/4] overflow-hidden bg-muted">
        {cover && (
          <Media
            fill
            htmlElement={null}
            imgClassName={
              hoverPhoto && !sold
                ? 'object-cover transition-opacity duration-300 group-hover:opacity-0'
                : 'object-cover transition-transform duration-500 group-hover:scale-[1.03]'
            }
            priority={priority}
            resource={cover}
            size="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        )}
        {hoverPhoto && !sold && (
          <Media
            fill
            htmlElement={null}
            imgClassName="object-cover opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            resource={hoverPhoto}
            size="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        )}
        {discount !== null && !sold && (
          <span className="absolute left-3 top-3 bg-red-600 px-2 py-1 text-[11px] font-bold text-white">
            -{discount}%
          </span>
        )}
        {!sold && (
          <span className="absolute bottom-3 left-3 bg-background/90 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.15em] backdrop-blur-sm">
            1 of 1
          </span>
        )}
        {sold && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/60 backdrop-blur-[2px]">
            <span className="border border-foreground px-5 py-2 text-xs font-bold uppercase tracking-[0.3em]">
              Sold
            </span>
          </div>
        )}
      </div>
      <div className="mt-3 space-y-1">
        <h3 className="truncate text-[13px] font-semibold uppercase tracking-wide">{title}</h3>
        {subtitle && (
          <p className="text-[11px] uppercase tracking-wide text-muted-foreground">{subtitle}</p>
        )}
        <p className="flex items-baseline gap-2 text-sm">
          <span className="font-bold">
            PKR {typeof price === 'number' ? price.toLocaleString('en-PK') : price}
          </span>
          {discount !== null && (
            <span className="text-xs text-muted-foreground line-through">
              PKR {originalPrice?.toLocaleString('en-PK')}
            </span>
          )}
        </p>
      </div>
    </Link>
  )
}
