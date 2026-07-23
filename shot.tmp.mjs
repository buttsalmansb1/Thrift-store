import { chromium } from '@playwright/test'
import path from 'path'

const outDir = process.argv[2]
const browser = await chromium.launch({ channel: 'msedge' })

const shots = [
  { name: 'home-desktop', url: 'http://localhost:3000/', width: 1440, height: 900, full: true },
  { name: 'home-mobile', url: 'http://localhost:3000/', width: 390, height: 844, full: true },
  {
    name: 'product-desktop',
    url: 'http://localhost:3000/products/vintage-levis-denim-jacket',
    width: 1440,
    height: 900,
    full: true,
  },
  {
    name: 'product-mobile',
    url: 'http://localhost:3000/products/adidas-court-sneakers',
    width: 390,
    height: 844,
    full: true,
  },
  {
    name: 'admin-products',
    url: 'http://localhost:3000/admin/collections/products',
    width: 1440,
    height: 900,
    full: false,
    login: true,
  },
]

for (const s of shots) {
  const page = await browser.newPage({ viewport: { width: s.width, height: s.height } })
  if (s.login) {
    await page.goto('http://localhost:3000/admin/login', { waitUntil: 'networkidle', timeout: 60000 })
    const email = page.locator('input[name="email"]')
    if (await email.count()) {
      await email.fill(process.env.SEED_EMAIL)
      await page.locator('input[name="password"]').fill(process.env.SEED_PASS)
      await page.locator('button[type="submit"]').click()
      await page.waitForTimeout(2500)
    }
  }
  await page.goto(s.url, { waitUntil: 'networkidle', timeout: 60000 })
  await page.waitForTimeout(1200)
  await page.screenshot({ path: path.join(outDir, `${s.name}.png`), fullPage: s.full })
  console.log('shot', s.name)
  await page.close()
}

await browser.close()
