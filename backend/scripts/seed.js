require('dotenv').config()

const { pool } = require('../src/config/db')
const {
  ALL,
  blog,
  programs,
  donationMethods,
  tim,
  kamiPeduli,
  donor,
  kontak,
  tentang,
} = require('../db/defaults')

// Warna kartu program: dari kelas Tailwind lama → satu kata kunci theme.
const THEME_FROM_BADGE = {
  'bg-green-100': 'green',
  'bg-amber-100': 'amber',
  'bg-indigo-100': 'indigo',
  'bg-emerald-100': 'emerald',
}

;(async () => {
  try {
    // site_content sudah tidak dipakai (ALL kosong) — loop ini no-op, disimpan
    // agar aman kalau nanti ada key yang perlu di-seed lagi.
    for (const [key, data] of Object.entries(ALL)) {
      await pool.query(
        `insert into site_content (key, data) values ($1, $2::jsonb)
         on conflict (key) do nothing`,
        [key, JSON.stringify(data)],
      )
    }

    // Blog & Kursus — isi tabel blog_posts hanya kalau masih kosong.
    const { rows: blogCnt } = await pool.query('select count(*)::int as n from blog_posts')
    if (blogCnt[0].n === 0) {
      for (const p of blog) {
        await pool.query(
          `insert into blog_posts (slug, title, badge, "date", image, "desc", content)
           values ($1, $2, $3, $4, $5, $6, $7::jsonb)
           on conflict (slug) do nothing`,
          [p.slug, p.title, p.badge || null, p.date || null, p.image || null, p.desc || null, JSON.stringify(p.content || [])],
        )
      }
      console.log('✓ seed blog_posts:', blog.length, 'artikel')
    }

    // Daftar Program — isi tabel programs hanya kalau masih kosong.
    const { rows: progCnt } = await pool.query('select count(*)::int as n from programs')
    if (progCnt[0].n === 0) {
      let order = 0
      for (const p of programs) {
        await pool.query(
          `insert into programs
             (slug, title, badge, icon, image, jenis_id, theme, "desc", harapan,
              deskripsi, manfaat, target, collected, donors, sort_order)
           values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10::jsonb,$11::jsonb,$12,$13,$14,$15)
           on conflict (slug) do nothing`,
          [
            p.id,
            p.title,
            p.badge || null,
            p.icon || null,
            p.image || null,
            p.jenisId || null,
            THEME_FROM_BADGE[p.badgeBg] || 'green',
            p.desc || null,
            p.harapan || null,
            JSON.stringify(p.deskripsiLengkap || []),
            JSON.stringify(p.manfaat || []),
            p.target || 0,
            p.collected || 0,
            p.donors || 0,
            order++,
          ],
        )
      }
      console.log('✓ seed programs:', programs.length, 'program')
    }

    // Rekening bank — isi tabel bank_accounts hanya kalau masih kosong.
    const { rows: bankCnt } = await pool.query('select count(*)::int as n from bank_accounts')
    if (bankCnt[0].n === 0) {
      let total = 0
      for (const scope of ['tentang', 'program']) {
        const banks = (donationMethods[scope] && donationMethods[scope].banks) || []
        let order = 0
        for (const b of banks) {
          await pool.query(
            `insert into bank_accounts (scope, name, short, no_rek, owner, badge_class, sort_order)
             values ($1, $2, $3, $4, $5, $6, $7)`,
            [scope, b.name, b.short || null, b.noRek || '', b.owner || 'LAZIS PT PLN Batam', b.badgeClass || null, order++],
          )
          total += 1
        }
      }
      console.log('✓ seed bank_accounts:', total, 'rekening')
    }

    // Jenis donasi — isi tabel donation_types hanya kalau masih kosong.
    const { rows: jtCnt } = await pool.query('select count(*)::int as n from donation_types')
    if (jtCnt[0].n === 0) {
      let total = 0
      for (const scope of ['tentang', 'program']) {
        const jenis = (donationMethods[scope] && donationMethods[scope].jenis) || []
        let order = 0
        for (const j of jenis) {
          await pool.query(
            `insert into donation_types (scope, key, label, program_label, sort_order)
             values ($1, $2, $3, $4, $5)
             on conflict (scope, key) do nothing`,
            [scope, j.id, j.label, j.programLabel || j.label, order++],
          )
          total += 1
        }
      }
      console.log('✓ seed donation_types:', total, 'jenis')
    }

    // Anggota tim — isi tabel team_members hanya kalau masih kosong.
    const { rows: teamCnt } = await pool.query('select count(*)::int as n from team_members')
    if (teamCnt[0].n === 0) {
      let order = 0
      for (const m of tim) {
        await pool.query(
          `insert into team_members (name, role, sort_order) values ($1, $2, $3)`,
          [m.name, m.role, order++],
        )
      }
      console.log('✓ seed team_members:', tim.length, 'anggota')
    }

    // Dokumentasi — video & foto galeri Kami Peduli.
    const { rows: dvCnt } = await pool.query('select count(*)::int as n from doc_videos')
    if (dvCnt[0].n === 0) {
      let order = 0
      for (const v of kamiPeduli.videos || []) {
        await pool.query(
          `insert into doc_videos (title, video_url, image, badge, "desc", "date", duration, sort_order)
           values ($1,$2,$3,$4,$5,$6,$7,$8)`,
          [v.title, v.videoUrl || '', v.image || null, v.badge || null, v.desc || null, v.date || null, v.duration || null, order++],
        )
      }
      console.log('✓ seed doc_videos:', (kamiPeduli.videos || []).length, 'video')
    }
    const { rows: dpCnt } = await pool.query('select count(*)::int as n from doc_photos')
    if (dpCnt[0].n === 0) {
      let order = 0
      for (const f of kamiPeduli.galeri || []) {
        await pool.query(
          `insert into doc_photos (image, caption, sort_order) values ($1, $2, $3)`,
          [f.image || '', f.caption || '', order++],
        )
      }
      console.log('✓ seed doc_photos:', (kamiPeduli.galeri || []).length, 'foto')
    }

    // Informasi Donatur — satu baris (id=1), hanya kalau belum ada.
    const { rows: diCnt } = await pool.query('select count(*)::int as n from donor_info')
    if (diCnt[0].n === 0) {
      await pool.query(
        `insert into donor_info (id, title, description, stats)
         values (1, $1, $2, $3::jsonb)`,
        [donor.title || '', donor.description || '', JSON.stringify(donor.stats || [])],
      )
      console.log('✓ seed donor_info')
    }

    // Konten "Kami Peduli" — satu baris (id=1), hanya kalau belum ada.
    // videos & galeri tidak ikut (sudah di doc_videos / doc_photos).
    const { rows: hpCnt } = await pool.query('select count(*)::int as n from home_page')
    if (hpCnt[0].n === 0) {
      const { videos: _v, galeri: _g, ...homeData } = kamiPeduli
      await pool.query(`insert into home_page (id, data) values (1, $1::jsonb)`, [JSON.stringify(homeData)])
      console.log('✓ seed home_page')
    }

    // Konten Tentang Kami — satu baris (id=1), hanya kalau belum ada.
    const { rows: apCnt } = await pool.query('select count(*)::int as n from about_page')
    if (apCnt[0].n === 0) {
      await pool.query(`insert into about_page (id, data) values (1, $1::jsonb)`, [JSON.stringify(tentang)])
      console.log('✓ seed about_page')
    }

    // Konten Kontak Kami — satu baris (id=1), hanya kalau belum ada.
    const { rows: cpCnt } = await pool.query('select count(*)::int as n from contact_page')
    if (cpCnt[0].n === 0) {
      await pool.query(
        `insert into contact_page (id, hero, info, form)
         values (1, $1::jsonb, $2::jsonb, $3::jsonb)`,
        [
          JSON.stringify(kontak.hero || {}),
          JSON.stringify(kontak.info || []),
          JSON.stringify(kontak.form || {}),
        ],
      )
      console.log('✓ seed contact_page')
    }

    // Tabel donations tidak di-seed — diisi dari donasi asli lewat modal.
  } catch (err) {
    console.error('✗ seed gagal:', err.message)
    process.exitCode = 1
  } finally {
    await pool.end()
  }
})()
