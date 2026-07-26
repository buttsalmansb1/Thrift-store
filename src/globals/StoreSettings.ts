import type { GlobalConfig } from 'payload'

import { revalidatePath, revalidateTag } from 'next/cache'

import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'

export const StoreSettings: GlobalConfig = {
  slug: 'store-settings',
  access: {
    read: anyone,
    update: authenticated,
  },
  admin: {
    description: 'Your contact and payment details shown on every product page.',
  },
  fields: [
    {
      name: 'storeName',
      type: 'text',
      required: true,
      defaultValue: 'THRIFTED.',
      admin: {
        description: 'Shown as the logo in the header and footer.',
      },
    },
    {
      name: 'tagline',
      type: 'text',
      defaultValue: 'Curated pre-loved fashion. One piece each — gone when it’s gone.',
    },
    {
      name: 'announcementText',
      type: 'text',
      defaultValue: 'CASH ON DELIVERY ALL OVER PAKISTAN — EVERY PIECE IS 1 OF 1',
      admin: {
        description: 'Scrolling bar at the very top of the site.',
      },
    },
    {
      name: 'instagramUrl',
      type: 'text',
      admin: {
        description: 'Full link to your Instagram profile (optional).',
      },
    },
    {
      name: 'heroImage',
      type: 'upload',
      relationTo: 'media',
      filterOptions: { mimeType: { contains: 'image' } },
      admin: {
        description: 'Big cover photo at the top of the homepage.',
      },
    },
    {
      name: 'heroImageAlt',
      type: 'upload',
      relationTo: 'media',
      filterOptions: { mimeType: { contains: 'image' } },
      admin: {
        description: 'Optional second cover photo — the hero slowly cross-fades between the two.',
      },
    },
    {
      name: 'heroImageMobile',
      type: 'upload',
      relationTo: 'media',
      filterOptions: { mimeType: { contains: 'image' } },
      admin: {
        description: 'Portrait version of the cover photo shown on phones (optional).',
      },
    },
    {
      name: 'heroImageAltMobile',
      type: 'upload',
      relationTo: 'media',
      filterOptions: { mimeType: { contains: 'image' } },
      admin: {
        description: 'Portrait version of the second cover photo shown on phones (optional).',
      },
    },
    {
      name: 'lookbookImages',
      type: 'upload',
      relationTo: 'media',
      hasMany: true,
      maxRows: 3,
      filterOptions: { mimeType: { contains: 'image' } },
      admin: {
        description: 'Up to 3 style photos shown in "The Edit" section on the homepage.',
      },
    },
    {
      name: 'whatsappNumber',
      type: 'text',
      required: true,
      defaultValue: '923000000000',
      admin: {
        description:
          'WhatsApp number in international format, digits only (e.g. 923001234567). The "Chat to Buy" button opens this chat.',
      },
    },
    {
      name: 'easypaisaName',
      type: 'text',
      admin: {
        description: 'Account holder name shown to buyers.',
      },
    },
    {
      name: 'easypaisaNumber',
      type: 'text',
      admin: {
        description: 'EasyPaisa account number shown to buyers.',
      },
    },
    {
      name: 'codAvailable',
      type: 'checkbox',
      defaultValue: true,
      label: 'Cash on Delivery available',
    },
    {
      name: 'deliveryCharge',
      type: 'number',
      defaultValue: 300,
      min: 0,
      admin: {
        description: 'Flat delivery charge in PKR added to COD orders.',
      },
    },
    {
      name: 'paymentNote',
      type: 'textarea',
      defaultValue:
        'Pay via EasyPaisa and send the screenshot on WhatsApp to confirm your order — or choose Cash on Delivery.',
      admin: {
        description: 'Shown under the payment details on every product page.',
      },
    },
  ],
  hooks: {
    afterChange: [
      ({ doc, req: { context } }) => {
        if (!context.disableRevalidate) {
          revalidateTag('global_store-settings', 'max')
          revalidatePath('/', 'layout')
        }
        return doc
      },
    ],
  },
}
