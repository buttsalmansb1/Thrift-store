'use client'

import React, { useMemo, useState } from 'react'

import type { Product } from '@/payload-types'

import { ProductCard } from '@/components/ProductCard'
import { Reveal } from '@/components/store/Reveal'
import { cn } from '@/utilities/ui'

export const FilterableGrid: React.FC<{ products: Product[] }> = ({ products }) => {
  const [active, setActive] = useState<number | 'all'>('all')

  const categories = useMemo(() => {
    const map = new Map<number, string>()
    for (const p of products) {
      if (p.category && typeof p.category === 'object') {
        map.set(p.category.id, p.category.title)
      }
    }
    return Array.from(map, ([id, title]) => ({ id, title }))
  }, [products])

  const filtered =
    active === 'all'
      ? products
      : products.filter((p) => typeof p.category === 'object' && p.category?.id === active)

  return (
    <div>
      {categories.length > 0 && (
        <div className="no-scrollbar -mx-4 mb-8 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:px-0">
          {[{ id: 'all' as const, title: 'All' }, ...categories].map((c) => (
            <button
              className={cn(
                'min-h-10 shrink-0 border px-5 py-2 text-xs font-bold uppercase tracking-[0.15em] transition-colors',
                active === c.id
                  ? 'border-foreground bg-foreground text-background'
                  : 'border-border hover:border-foreground/50',
              )}
              key={c.id}
              onClick={() => setActive(c.id)}
              type="button"
            >
              {c.title}
            </button>
          ))}
        </div>
      )}
      {filtered.length === 0 ? (
        <p className="py-16 text-center text-muted-foreground">
          Nothing in this category right now — new drop coming soon.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4 lg:gap-x-6">
          {filtered.map((product, i) => (
            <Reveal delay={(i % 4) * 0.06} key={product.id}>
              <ProductCard priority={i < 4} product={product} />
            </Reveal>
          ))}
        </div>
      )}
    </div>
  )
}
