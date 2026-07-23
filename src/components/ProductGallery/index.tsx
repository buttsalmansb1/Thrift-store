'use client'

import React, { useRef, useState } from 'react'

import type { Media as MediaType } from '@/payload-types'

import { Media } from '@/components/Media'
import { cn } from '@/utilities/ui'

type Props = {
  photos: MediaType[]
  video?: MediaType | null
}

export const ProductGallery: React.FC<Props> = ({ photos, video }) => {
  const items: MediaType[] = video ? [...photos, video] : photos
  const [selected, setSelected] = useState(0)
  const trackRef = useRef<HTMLDivElement>(null)
  const current = items[selected]

  const onScroll = () => {
    const el = trackRef.current
    if (!el) return
    const i = Math.round(el.scrollLeft / el.clientWidth)
    if (i !== selected) setSelected(Math.min(items.length - 1, Math.max(0, i)))
  }

  return (
    <div>
      {/* Mobile: swipeable snap carousel */}
      <div className="lg:hidden">
        <div
          className="no-scrollbar flex snap-x snap-mandatory overflow-x-auto"
          onScroll={onScroll}
          ref={trackRef}
        >
          {items.map((item, i) => (
            <div
              className="relative aspect-[3/4] w-full shrink-0 snap-center overflow-hidden bg-card"
              key={item.id ?? i}
            >
              <Media
                fill
                htmlElement={null}
                imgClassName="object-cover"
                priority={i === 0}
                resource={item}
                size="100vw"
                videoClassName="h-full w-full object-cover"
              />
            </div>
          ))}
        </div>
        {items.length > 1 && (
          <div className="mt-3 flex items-center justify-center gap-2">
            {items.map((_, i) => (
              <span
                className={cn(
                  'h-1.5 rounded-full transition-all duration-200',
                  i === selected ? 'w-6 bg-foreground' : 'w-1.5 bg-foreground/25',
                )}
                key={i}
              />
            ))}
          </div>
        )}
      </div>

      {/* Desktop: main image + thumbnails */}
      <div className="hidden lg:block">
        <div className="relative aspect-[3/4] overflow-hidden rounded-xl border border-border bg-card">
          {current && (
            <Media
              fill={!current.mimeType?.includes('video')}
              htmlElement={null}
              imgClassName="object-cover"
              priority
              resource={current}
              size="50vw"
              videoClassName="h-full w-full object-contain"
            />
          )}
        </div>
        {items.length > 1 && (
          <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
            {items.map((item, i) => (
              <button
                aria-label={`View ${item.mimeType?.includes('video') ? 'video' : `photo ${i + 1}`}`}
                className={cn(
                  'relative h-20 w-16 shrink-0 overflow-hidden border transition-colors',
                  i === selected ? 'border-foreground' : 'border-border hover:border-foreground/50',
                )}
                key={item.id ?? i}
                onClick={() => setSelected(i)}
                type="button"
              >
                {item.mimeType?.includes('video') ? (
                  <span className="flex h-full w-full items-center justify-center bg-muted text-xs font-medium">
                    ▶
                  </span>
                ) : (
                  <Media
                    fill
                    htmlElement={null}
                    imgClassName="object-cover"
                    resource={item}
                    size="64px"
                  />
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
