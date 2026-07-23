import React from 'react'

export const AnnouncementBar: React.FC<{ text?: string | null }> = ({ text }) => {
  if (!text) return null

  const items = Array.from({ length: 8 }, (_, i) => (
    <span className="mx-8 inline-block" key={i}>
      {text}
    </span>
  ))

  return (
    <div className="overflow-hidden bg-[#241b12] py-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#e9e0d2]">
      <div className="marquee flex w-max whitespace-nowrap motion-reduce:animate-none">
        {items}
        {items}
      </div>
    </div>
  )
}
