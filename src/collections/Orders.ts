import type { CollectionConfig } from 'payload'

import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'

export const Orders: CollectionConfig = {
  slug: 'orders',
  access: {
    create: anyone, // customers place orders from the website
    delete: authenticated,
    read: authenticated,
    update: authenticated,
  },
  admin: {
    useAsTitle: 'orderLabel',
    defaultColumns: ['orderLabel', 'status', 'total', 'createdAt'],
    description: 'Cash on Delivery orders placed on the website. Confirm on WhatsApp, then update the status.',
  },
  fields: [
    {
      name: 'orderLabel',
      type: 'text',
      admin: {
        hidden: true,
      },
      hooks: {
        beforeChange: [
          ({ data }) => `${data?.productTitle ?? 'Order'} — ${data?.customerName ?? ''}`,
        ],
      },
    },
    {
      name: 'product',
      type: 'relationship',
      relationTo: 'products',
      required: true,
    },
    {
      name: 'productTitle',
      type: 'text',
      required: true,
    },
    {
      name: 'customerName',
      type: 'text',
      required: true,
      label: 'Customer name',
    },
    {
      name: 'phone',
      type: 'text',
      required: true,
    },
    {
      name: 'address',
      type: 'textarea',
      required: true,
    },
    {
      name: 'city',
      type: 'text',
      required: true,
    },
    {
      name: 'postalCode',
      type: 'text',
    },
    {
      name: 'itemPrice',
      type: 'number',
      required: true,
    },
    {
      name: 'deliveryCharge',
      type: 'number',
      required: true,
    },
    {
      name: 'total',
      type: 'number',
      required: true,
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'new',
      options: [
        { label: 'New', value: 'new' },
        { label: 'Confirmed', value: 'confirmed' },
        { label: 'Shipped', value: 'shipped' },
        { label: 'Delivered', value: 'delivered' },
        { label: 'Cancelled', value: 'cancelled' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
  ],
  timestamps: true,
}
