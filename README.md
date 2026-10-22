# Elevate — Undangan Wisuda Digital

Static site undangan wisuda. Tanpa database, tanpa backend. Semua data di JSON.

## Cara pakai

1. Edit `public/data/graduates.json` — tambah wisudawan.
2. Edit `public/data/wishes.json` — tambah ucapan.
3. Taruh foto di `public/assets/img/`.
4. Push ke GitHub → Vercel auto-deploy.

## URL

- Landing: `/`
- Undangan: `/u/{slug}`
- Undangan personal: `/u/{slug}?to=Nama+Tamu`

## Deploy

1. Push repo ke GitHub.
2. Import di [vercel.com/new](https://vercel.com/new).
3. Framework Preset: **Other**. Deploy.
