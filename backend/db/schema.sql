-- Konten situs disimpan per "key" sebagai satu dokumen JSON.
-- key: kami-peduli | tentang | kontak | donor | donation-methods | programs | blog | tim
create table if not exists site_content (
  key         text primary key,
  data        jsonb not null,
  updated_at  timestamptz not null default now()
);

-- Riwayat donasi via transfer (dikirim dari modal "Donasi via Transfer",
-- diverifikasi admin di menu "Riwayat Donasi").
create table if not exists donations (
  id           bigserial primary key,
  donor_name   text not null default 'Anonim',
  anonymous    boolean not null default false,
  jenis_id     text,
  jenis_label  text,
  program      text,
  amount       bigint not null check (amount >= 0),
  bank_id      text,
  bank_name    text,
  note         text,
  proof        text,
  status       text not null default 'menunggu'
               check (status in ('menunggu', 'terverifikasi', 'ditolak')),
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- Asal donasi: 'program' (kartu Daftar Program) | 'tentang' (Donasi via
-- Transfer di Tentang Kami) | 'umum'. Ditambah terpisah agar aman dijalankan
-- di database yang tabelnya sudah ada.
alter table donations add column if not exists source text not null default 'umum';

-- Kolom NIK karyawan tidak dipakai lagi — dibuang. Aman dijalankan berulang.
alter table donations drop column if exists nik;

create index if not exists donations_status_idx on donations (status);
create index if not exists donations_source_idx on donations (source);
create index if not exists donations_created_idx on donations (created_at desc);

-- Artikel "Blog & Kursus" — dikelola penuh (CRUD) oleh admin di menu
-- "Blog & Kursus", ditampilkan di halaman publik /donatur/blog. Tabel
-- relasional tersendiri (bukan satu dokumen JSON di site_content).
-- Nama kolom sengaja disamakan dengan field form admin: title, badge,
-- "date", image, "desc", content. ("date" & "desc" kata kunci SQL, jadi
-- selalu ditulis dalam tanda kutip ganda.)
create table if not exists blog_posts (
  id          bigserial primary key,
  slug        text not null unique,
  title       text not null,
  badge       text,
  "date"      text,                                 -- tanggal tampilan bebas, mis. "12 Jan 2025"
  image       text,                                 -- data URL hasil upload / path gambar
  "desc"      text,                                 -- ringkasan singkat (kartu blog)
  content     jsonb not null default '[]'::jsonb,   -- array paragraf isi artikel
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- Selaraskan nama kolom untuk DB yang tabelnya dibuat versi sebelumnya
-- (date_label → "date", excerpt → "desc"). Aman dijalankan berulang.
do $$
begin
  if exists (select 1 from information_schema.columns
             where table_name = 'blog_posts' and column_name = 'date_label') then
    alter table blog_posts rename column date_label to "date";
  end if;
  if exists (select 1 from information_schema.columns
             where table_name = 'blog_posts' and column_name = 'excerpt') then
    alter table blog_posts rename column excerpt to "desc";
  end if;
end $$;

-- Sembunyikan artikel dari halaman Blog donatur tanpa menghapusnya.
alter table blog_posts add column if not exists active boolean not null default true;

create index if not exists blog_posts_created_idx on blog_posts (created_at desc);

-- "Daftar Program" — CRUD penuh oleh admin di menu "Daftar Program",
-- ditampilkan di /donatur/program dan /donatur/program/:slug.
-- Warna kartu disimpan sebagai satu kata kunci `theme` (green|amber|indigo|
-- emerald); kelas Tailwind-nya di-expand di frontend.
create table if not exists programs (
  id           bigserial primary key,
  slug         text not null unique,
  title        text not null,
  badge        text,
  icon         text,
  image        text,
  jenis_id     text,                                  -- id jenis donasi (donation-methods scope 'program')
  theme        text not null default 'green',
  "desc"       text,                                  -- ringkasan kartu
  harapan      text,
  deskripsi    jsonb not null default '[]'::jsonb,    -- array paragraf (deskripsiLengkap)
  manfaat      jsonb not null default '[]'::jsonb,    -- array poin manfaat
  target       bigint not null default 0,
  collected    bigint not null default 0,
  donors       integer not null default 0,
  sort_order   integer not null default 0,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- Dua cara "menutup" program (terpisah, aman untuk DB lama):
--   active = false        → program disembunyikan sepenuhnya dari halaman donatur
--   donation_open = false  → program tetap tampil di donatur, tapi tombol donasi
--                            dinonaktifkan + keterangan "Donasi Ditutup".
alter table programs add column if not exists active boolean not null default true;
alter table programs add column if not exists donation_open boolean not null default true;

create index if not exists programs_sort_idx on programs (sort_order, created_at);

-- Rekening bank tujuan transfer. `scope`: 'tentang' (Donasi via Transfer di
-- Tentang Kami) atau 'program' (tombol Donasi pada kartu program).
create table if not exists bank_accounts (
  id           bigserial primary key,
  scope        text not null default 'tentang' check (scope in ('tentang', 'program')),
  name         text not null,
  short        text,
  no_rek       text not null,
  owner        text,                                 -- nama pemilik rekening (a.n. ...)
  badge_class  text,
  sort_order   integer not null default 0,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- Kolom nama pemilik ditambah terpisah agar aman untuk DB yang tabelnya sudah ada.
alter table bank_accounts add column if not exists owner text;

create index if not exists bank_accounts_scope_idx on bank_accounts (scope, sort_order, created_at);

-- Jenis donasi (Zakat Profesi, Infaq, dst) per `scope`. `key` = slug stabil
-- yang dipakai programs.jenis_id / donations.jenis_id; `label` teks tampilan.
create table if not exists donation_types (
  id            bigserial primary key,
  scope         text not null default 'tentang' check (scope in ('tentang', 'program')),
  key           text not null,
  label         text not null,
  program_label text,
  sort_order    integer not null default 0,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  unique (scope, key)
);

create index if not exists donation_types_scope_idx on donation_types (scope, sort_order, created_at);

-- Anggota tim yang tampil di halaman "Tentang Kami" — CRUD penuh oleh admin
-- di menu "Tim".
create table if not exists team_members (
  id          bigserial primary key,
  name        text not null,
  role        text not null default '',
  photo       text,                                 -- data URL hasil upload / path foto
  sort_order  integer not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- Kolom foto ditambah terpisah agar aman untuk DB yang tabelnya sudah ada.
alter table team_members add column if not exists photo text;

create index if not exists team_members_sort_idx on team_members (sort_order, created_at);

-- Dokumentasi Kami Peduli — video YouTube "Bukti Nyata".
create table if not exists doc_videos (
  id          bigserial primary key,
  title       text not null,
  video_url   text not null,                        -- URL tonton YouTube
  image       text,                                 -- thumbnail (auto YT / custom)
  badge       text,
  "desc"      text,
  "date"      text,
  duration    text,
  sort_order  integer not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- Sembunyikan video dari halaman Kami Peduli donatur tanpa menghapusnya.
alter table doc_videos add column if not exists active boolean not null default true;

create index if not exists doc_videos_sort_idx on doc_videos (sort_order, created_at);

-- Dokumentasi Kami Peduli — galeri foto.
create table if not exists doc_photos (
  id          bigserial primary key,
  image       text not null,                        -- URL hasil upload
  caption     text not null default '',
  sort_order  integer not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- Sembunyikan foto dari galeri Kami Peduli donatur tanpa menghapusnya.
alter table doc_photos add column if not exists active boolean not null default true;

create index if not exists doc_photos_sort_idx on doc_photos (sort_order, created_at);

-- "Informasi Donatur" — satu baris (id selalu 1) berisi judul, pengantar, dan
-- daftar ringkasan jumlah donatur.
create table if not exists donor_info (
  id          smallint primary key default 1 check (id = 1),
  title       text not null default '',
  description text not null default '',
  stats       jsonb not null default '[]'::jsonb,
  updated_at  timestamptz not null default now()
);

-- Konten "Kami Peduli" (halaman utama donatur: hero, heading section program,
-- heading galeri, blok Konsultasi + FAQ) — satu baris (id selalu 1), disimpan
-- sebagai satu dokumen JSON. Daftar video & foto galeri TIDAK di sini — sudah
-- punya tabel sendiri (doc_videos, doc_photos).
create table if not exists home_page (
  id          smallint primary key default 1 check (id = 1),
  data        jsonb not null default '{}'::jsonb,
  updated_at  timestamptz not null default now()
);

-- Konten halaman "Tentang Kami" — satu baris (id selalu 1). Seluruh konten
-- (hero, keunggulan, visi/misi, sejarah, milestone, pencapaian, nilai, teks
-- header section Tim, dst) disimpan sebagai satu dokumen JSON supaya mudah
-- dikembangkan. Daftar anggota tim TIDAK di sini — itu tetap di tabel
-- team_members.
create table if not exists about_page (
  id          smallint primary key default 1 check (id = 1),
  data        jsonb not null default '{}'::jsonb,
  updated_at  timestamptz not null default now()
);

-- Konten halaman "Kontak Kami" — satu baris (id selalu 1).
create table if not exists contact_page (
  id          smallint primary key default 1 check (id = 1),
  hero        jsonb not null default '{}'::jsonb,   -- { label, titleMain, titleHighlight, description }
  info        jsonb not null default '[]'::jsonb,   -- [ { id, type, label, value } ]
  form        jsonb not null default '{}'::jsonb,   -- { title, description, buttonLabel }
  updated_at  timestamptz not null default now()
);

-- Pesan dari pengunjung lewat formulir "Kirim Pesan" di halaman Kontak Kami.
-- Ditampilkan di menu admin "Pesan Masuk"; admin membalas sendiri lewat email.
create table if not exists contact_messages (
  id          bigserial primary key,
  name        text not null default '',
  email       text not null default '',
  message     text not null default '',
  status      text not null default 'baru' check (status in ('baru', 'dibaca', 'selesai')),
  created_at  timestamptz not null default now()
);

-- No. HP pengirim + bukti persetujuan pelindungan data pribadi (UU No. 27
-- Tahun 2022). Aman dijalankan berulang untuk DB lama.
alter table contact_messages add column if not exists phone text not null default '';
alter table contact_messages add column if not exists consent_pdp boolean not null default false;

create index if not exists contact_messages_created_idx on contact_messages (created_at desc);

-- Akun admin panel. Login mengecek tabel ini dulu; kalau username tidak ada
-- di sini, jatuh ke akun bawaan dari environment (ADMIN_USERNAME/PASSWORD)
-- supaya akses awal tidak pernah terkunci. Password disimpan sebagai hash
-- scrypt (lib/password.js), bukan teks polos.
create table if not exists admin_accounts (
  id            bigserial primary key,
  username      text not null unique,
  name          text not null default '',
  nik           text not null default '',
  email         text not null default '',
  password_hash text not null,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- Editor teks visual ala WordPress: tiap elemen teks yang punya ikon pensil
-- di panel admin menyimpan ISI + seluruh konfigurasi tampilannya di sini,
-- di-key oleh `element_key` unik (mis. "homepage.hero.title"). Kolom style
-- boleh null → frontend memakai style bawaan komponen. Tabel baru, tidak
-- menyentuh data konten yang sudah ada.
create table if not exists text_elements (
  id              bigserial primary key,
  element_key     text not null unique,
  page            text not null default '',
  section         text not null default '',
  content         text,
  font_family     text,
  font_size       text,
  font_weight     text,
  font_style      text,
  text_decoration text,
  text_color      text,
  text_align      text,
  line_height     text,
  letter_spacing  text,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- Geser posisi elemen teks (px, boleh negatif) — admin bisa menata letak
-- teks dengan drag di halaman "Konten Kami Peduli". Aman untuk DB lama.
alter table text_elements add column if not exists offset_x text;
alter table text_elements add column if not exists offset_y text;
-- Panjang / lebar maksimum blok teks (mis. "520px", "60%").
alter table text_elements add column if not exists box_width text;

-- Draf: admin klik "Simpan Semua" menulis ke sini dulu (BUKAN kolom di
-- atas), supaya halaman publik/donatur belum melihat perubahannya. Kolom
-- di atas cuma berubah saat admin klik "Selesai Edit" (endpoint publish),
-- yang menyalin isi draft ke situ lalu mengosongkan draft ini lagi.
-- `draft` = object berisi field yang diubah saja (content/style/offset/dst),
-- `draft_reset` = true kalau draf-nya adalah "kembalikan ke bawaan".
alter table text_elements add column if not exists draft jsonb;
alter table text_elements add column if not exists draft_reset boolean not null default false;

create index if not exists text_elements_page_idx on text_elements (page);

-- =====================================================================
-- Manajemen Menu / Navbar Dinamis + halaman bertemplate (CMS sederhana).
-- Navbar frontend membaca tabel `menus`; admin bisa tambah/edit/urutkan/
-- sembunyikan/hapus menu & submenu tanpa ubah kode.
--   template_type: system  → link ke halaman existing (system_path), tak bisa dihapus
--                  text     → halaman teks biasa (rich text)
--                  blog     → halaman artikel tunggal   (Fase 2)
--                  program  → halaman program            (Fase 2)
-- =====================================================================
create table if not exists menus (
  id            bigserial primary key,
  name          text not null,
  slug          text not null unique,
  template_type text not null default 'text',
  system_path   text,
  parent_id     bigint references menus(id) on delete set null,
  sort_order    integer not null default 0,
  is_visible    boolean not null default true,
  open_new_tab  boolean not null default false,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);
create index if not exists menus_sort_idx on menus (parent_id, sort_order);

-- Konten halaman per menu (template text/blog/program). `data` jsonb menyimpan
-- field khusus tiap template supaya fleksibel tanpa migrasi tiap nambah field.
create table if not exists menu_pages (
  menu_id     bigint primary key references menus(id) on delete cascade,
  title       text not null default '',
  hero_image  text,
  body_html   text not null default '',
  data        jsonb not null default '{}'::jsonb,
  status      text not null default 'draft',
  updated_at  timestamptz not null default now()
);

-- Seed 5 menu "system" = navbar existing. Aman dijalankan berulang —
-- baris yang sudah ada tidak disentuh (on conflict do nothing).
insert into menus (name, slug, template_type, system_path, sort_order) values
  ('Kami Peduli',    'kami-peduli',    'system', '/donatur#programs',      1),
  ('Blog',           'blog',           'system', '/donatur/blog',          2),
  ('Tentang Kami',   'tentang-kami',   'system', '/donatur/tentang-kami',  3),
  ('Daftar Program', 'daftar-program', 'system', '/donatur/program',       4),
  ('Kontak Kami',    'kontak-kami',    'system', '/donatur/kontak-kami',   5)
on conflict (slug) do nothing;
