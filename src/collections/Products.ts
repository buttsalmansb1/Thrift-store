import type { CollectionConfig } from 'payload'

import { revalidatePath } from 'next/cache'
import { slugField } from 'payload'

import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'

export const Products: CollectionConfig = {
  slug: 'products',
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'price', 'sold', 'updatedAt'],
    description: 'Each article is one piece. Tick "Sold" once it is gone.',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'photos',
      type: 'upload',
      relationTo: 'media',
      hasMany: true,
      required: true,
      filterOptions: { mimeType: { contains: 'image' } },
      admin: {
        description: 'First photo is the cover. Add as many as you like.',
      },
    },
    {
      name: 'video',
      type: 'upload',
      relationTo: 'media',
      filterOptions: { mimeType: { contains: 'video' } },
      admin: {
        description: 'Optional short video of the article.',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      admin: {
        description: 'Brand, measurements, flaws if any — whatever the buyer should know.',
      },
    },
    {
      name: 'price',
      type: 'number',
      required: true,
      min: 0,
      admin: {
        position: 'sidebar',
        description: 'Price in PKR',
      },
    },
    {
      name: 'originalPrice',
      type: 'number',
      min: 0,
      admin: {
        position: 'sidebar',
        description: 'Optional "was" price — shows a discount badge.',
      },
    },
    {
      name: 'sold',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'Tick when the article is sold.',
      },
    },
    {
      name: 'condition',
      type: 'select',
      options: [
        { label: 'New with tags', value: 'new-with-tags' },
        { label: 'Like new', value: 'like-new' },
        { label: 'Good', value: 'good' },
        { label: 'Fair', value: 'fair' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'size',
      type: 'text',
      admin: {
        position: 'sidebar',
        description: 'e.g. M, 32, 42 EU',
      },
    },
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'categories',
      admin: {
        position: 'sidebar',
      },
    },
    slugField({
      position: undefined,
    }),
  ],
  hooks: {
    afterChange: [
      ({ doc, req: { context } }) => {
        if (!context.disableRevalidate) {
          revalidatePath('/')
          revalidatePath(`/products/${doc.slug}`)
        }
        return doc
      },
    ],
    afterDelete: [
      ({ doc, req: { context } }) => {
        if (!context.disableRevalidate) {
          revalidatePath('/')
          revalidatePath(`/products/${doc.slug}`)
        }
        return doc
      },
    ],
  },
}
