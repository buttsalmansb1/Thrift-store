'use client'

import { CheckCircle2, PackageCheck, X } from 'lucide-react'
import React, { useState } from 'react'

import { WhatsAppIcon } from '@/components/store/WhatsAppIcon'

type Props = {
  deliveryCharge: number
  price: number
  productId: number
  productTitle: string
  productUrl: string
  whatsappNumber: string
}

export const CODOrderForm: React.FC<Props> = ({
  deliveryCharge,
  price,
  productId,
  productTitle,
  productUrl,
  whatsappNumber,
}) => {
  const [open, setOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [placed, setPlaced] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [form, setForm] = useState({
    customerName: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
  })

  const total = price + deliveryCharge

  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }))

  const waConfirmHref = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    `Assalam o Alaikum! I just placed a COD order on the website:\n\n*${productTitle}*\nTotal: PKR ${total.toLocaleString('en-PK')} (incl. Rs ${deliveryCharge} delivery)\n\nName: ${form.customerName}\nPhone: ${form.phone}\nAddress: ${form.address}\nCity: ${form.city}${form.postalCode ? `\nPostal code: ${form.postalCode}` : ''}\n\n${productUrl}`,
  )}`

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product: productId,
          productTitle,
          customerName: form.customerName.trim(),
          phone: form.phone.trim(),
          address: form.address.trim(),
          city: form.city.trim(),
          postalCode: form.postalCode.trim(),
          itemPrice: price,
          deliveryCharge,
          total,
        }),
      })
      if (!res.ok) throw new Error('failed')
      setPlaced(true)
      // hand the order to the seller's WhatsApp so they get notified instantly
      window.open(waConfirmHref, '_blank', 'noopener')
    } catch {
      setError('Could not place the order. Please try again, or order via WhatsApp.')
    } finally {
      setSubmitting(false)
    }
  }

  if (placed) {
    return (
      <div className="mt-4 border border-border bg-card p-5">
        <p className="flex items-center gap-2 font-bold uppercase tracking-wide text-green-700">
          <CheckCircle2 className="h-5 w-5" /> Order placed!
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          Pay <span className="font-semibold text-foreground">PKR {total.toLocaleString('en-PK')}</span> in
          cash when your parcel arrives. To confirm faster, send us your order on WhatsApp:
        </p>
        <a
          className="mt-4 flex w-full items-center justify-center gap-2 bg-[#25D366] px-5 py-3 text-sm font-bold uppercase tracking-wide text-white"
          href={waConfirmHref}
          rel="noopener noreferrer"
          target="_blank"
        >
          <WhatsAppIcon className="h-4 w-4" /> Send order on WhatsApp
        </a>
      </div>
    )
  }

  if (!open) {
    return (
      <button
        className="mt-3 flex w-full items-center justify-center gap-3 border-2 border-foreground px-6 py-4 text-sm font-bold uppercase tracking-[0.15em] transition-colors hover:bg-foreground hover:text-background"
        onClick={() => setOpen(true)}
        type="button"
      >
        <PackageCheck className="h-5 w-5" /> Cash on Delivery — Place Order
      </button>
    )
  }

  return (
    <form className="mt-3 border border-border bg-card p-5" onSubmit={submit}>
      <div className="flex items-center justify-between">
        <p className="text-xs font-bold uppercase tracking-[0.2em]">Cash on Delivery</p>
        <button aria-label="Close" onClick={() => setOpen(false)} type="button">
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-4 space-y-3">
        <label className="block text-sm">
          <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Full name *
          </span>
          <input
            autoComplete="name"
            className="min-h-12 w-full border border-border bg-background px-3 py-2"
            onChange={set('customerName')}
            required
            value={form.customerName}
          />
        </label>
        <label className="block text-sm">
          <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Phone (WhatsApp) *
          </span>
          <input
            autoComplete="tel"
            className="min-h-12 w-full border border-border bg-background px-3 py-2"
            inputMode="tel"
            onChange={set('phone')}
            placeholder="03XX XXXXXXX"
            required
            type="tel"
            value={form.phone}
          />
        </label>
        <label className="block text-sm">
          <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Delivery address *
          </span>
          <textarea
            autoComplete="street-address"
            className="w-full border border-border bg-background px-3 py-2"
            onChange={set('address')}
            required
            rows={2}
            value={form.address}
          />
        </label>
        <div className="grid grid-cols-2 gap-3">
          <label className="block text-sm">
            <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              City *
            </span>
            <input
              autoComplete="address-level2"
              className="min-h-12 w-full border border-border bg-background px-3 py-2"
              onChange={set('city')}
              required
              value={form.city}
            />
          </label>
          <label className="block text-sm">
            <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Postal code
            </span>
            <input
              autoComplete="postal-code"
              className="min-h-12 w-full border border-border bg-background px-3 py-2"
              inputMode="numeric"
              onChange={set('postalCode')}
              value={form.postalCode}
            />
          </label>
        </div>
      </div>

      <dl className="mt-4 space-y-1 border-t border-border pt-3 text-sm">
        <div className="flex justify-between">
          <dt className="text-muted-foreground">Article</dt>
          <dd>PKR {price.toLocaleString('en-PK')}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-muted-foreground">Delivery</dt>
          <dd>Rs {deliveryCharge.toLocaleString('en-PK')}</dd>
        </div>
        <div className="flex justify-between font-bold">
          <dt>Total — pay on delivery</dt>
          <dd>PKR {total.toLocaleString('en-PK')}</dd>
        </div>
      </dl>

      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

      <button
        className="mt-4 w-full bg-foreground px-6 py-4 text-sm font-bold uppercase tracking-[0.15em] text-background transition-opacity hover:opacity-85 disabled:opacity-50"
        disabled={submitting}
        type="submit"
      >
        {submitting ? 'Placing order…' : `Place COD Order — PKR ${total.toLocaleString('en-PK')}`}
      </button>
    </form>
  )
}
