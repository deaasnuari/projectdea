'use client'

// Konten "Kami Peduli" kini disimpan di tabel `home_page` di backend. Hook +
// klien API-nya ada di services/homePage.js — file ini hanya meneruskannya
// supaya import lama tetap jalan. (Video & galeri: services/docMedia.js)
export { useKamiPeduliContent } from '@/services/homePage'
