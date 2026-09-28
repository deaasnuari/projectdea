const { query } = require('../config/db')

const STATUSES = ['menunggu', 'terverifikasi', 'ditolak']
const SOURCES = ['program', 'tentang', 'umum']

async function create(d) {
  const source = SOURCES.includes(d.source) ? d.source : 'umum'
  const { rows } = await query(
    `insert into donations
       (donor_name, anonymous, jenis_id, jenis_label, program, source, amount,
        bank_id, bank_name, note, proof)
     values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
     returning *`,
    [
      d.donorName || 'Anonim',
      !!d.anonymous,
      d.jenisId || null,
      d.jenisLabel || null,
      d.program || null,
      source,
      Math.round(Number(d.amount) || 0),
      d.bankId || null,
      d.bankName || null,
      d.note || null,
      d.proof || null,
    ],
  )
  return rows[0]
}

// `trash: true` → isi Sampah (yang sudah dihapus); selain itu hanya donasi
// aktif (belum dihapus).
async function list({ status, source, jenis, trash = false, limit = 200 } = {}) {
  const params = []
  const conds = [trash ? 'deleted_at is not null' : 'deleted_at is null']
  if (status && STATUSES.includes(status)) {
    params.push(status)
    conds.push(`status = $${params.length}`)
  }
  if (source && SOURCES.includes(source)) {
    params.push(source)
    conds.push(`source = $${params.length}`)
  }
  if (jenis) {
    params.push(jenis)
    conds.push(`coalesce(jenis_label, jenis_id) = $${params.length}`)
  }
  const where = conds.length ? `where ${conds.join(' and ')}` : ''
  params.push(Math.min(Number(limit) || 200, 500))
  const { rows } = await query(
    `select id, donor_name, anonymous, jenis_id, jenis_label, program, source, amount,
            bank_id, bank_name, note,
            (proof is not null) as has_proof,
            status, created_at, deleted_at
     from donations ${where}
     order by ${trash ? 'deleted_at' : 'created_at'} desc
     limit $${params.length}`,
    params,
  )
  return rows
}

// Daftar jenis donasi yang benar-benar ada di riwayat (untuk isi dropdown filter).
async function jenisOptions() {
  const { rows } = await query(`
    select distinct coalesce(jenis_label, jenis_id) as jenis
    from donations
    where coalesce(jenis_label, jenis_id) is not null and deleted_at is null
    order by 1
  `)
  return rows.map((r) => r.jenis)
}

async function findProof(id) {
  const { rows } = await query('select proof from donations where id = $1', [id])
  return rows[0]?.proof || null
}

async function updateStatus(id, status) {
  if (!STATUSES.includes(status)) return null

  // Ambil kondisi sebelum diubah untuk hitung selisih ke program terkait.
  const { rows: before } = await query(
    'select status, amount, program, source from donations where id = $1 and deleted_at is null',
    [id],
  )
  if (!before[0]) return null
  const prev = before[0]

  const { rows } = await query(
    `update donations set status = $2, updated_at = now() where id = $1
     returning id, status`,
    [id, status],
  )
  if (!rows[0]) return null

  // Donasi lewat kartu "Daftar Program": begitu diverifikasi, nominalnya
  // ditambahkan ke "collected" program itu (+1 donatur). Kalau verifikasi
  // dibatalkan / ditolak lagi, dikembalikan. Target tidak diubah — persentase
  // di kartu program dihitung dari collected/target, jadi ikut naik sendiri.
  if (prev.source === 'program' && prev.program) {
    const wasVerified = prev.status === 'terverifikasi'
    const nowVerified = status === 'terverifikasi'
    let dAmount = 0
    let dDonor = 0
    if (!wasVerified && nowVerified) {
      dAmount = Math.round(Number(prev.amount) || 0)
      dDonor = 1
    } else if (wasVerified && !nowVerified) {
      dAmount = -Math.round(Number(prev.amount) || 0)
      dDonor = -1
    }
    if (dAmount !== 0 || dDonor !== 0) {
      await query(
        `update programs
            set collected = greatest(0, collected + $2),
                donors = greatest(0, donors + $3),
                updated_at = now()
          where title = $1`,
        [prev.program, dAmount, dDonor],
      )
    }
  }

  return rows[0]
}

// Donasi program yang sudah terverifikasi ikut menambah collected/donors
// program. Saat masuk Sampah kontribusinya dicabut (sign = -1), saat
// dipulihkan dikembalikan lagi (sign = +1).
async function adjustProgram(row, sign) {
  if (row.source !== 'program' || !row.program || row.status !== 'terverifikasi') return
  await query(
    `update programs
        set collected = greatest(0, collected + $2),
            donors = greatest(0, donors + $3),
            updated_at = now()
      where title = $1`,
    [row.program, sign * Math.round(Number(row.amount) || 0), sign],
  )
}

// "Hapus" = pindahkan ke Sampah (belum benar-benar dihapus).
async function remove(id) {
  const { rows } = await query(
    `update donations set deleted_at = now(), updated_at = now()
      where id = $1 and deleted_at is null
      returning status, amount, program, source`,
    [id],
  )
  if (!rows[0]) return false
  await adjustProgram(rows[0], -1)
  return true
}

// Keluarkan dari Sampah → aktif & dihitung lagi.
async function restore(id) {
  const { rows } = await query(
    `update donations set deleted_at = null, updated_at = now()
      where id = $1 and deleted_at is not null
      returning status, amount, program, source`,
    [id],
  )
  if (!rows[0]) return false
  await adjustProgram(rows[0], +1)
  return true
}

// Hapus permanen — hanya untuk yang sudah di Sampah (kontribusi programnya
// sudah dicabut waktu masuk Sampah, jadi tidak perlu diubah lagi).
async function purge(id) {
  const { rowCount } = await query('delete from donations where id = $1 and deleted_at is not null', [id])
  return rowCount > 0
}

// Versi banyak sekaligus — tetap per-id supaya kontribusi program benar.
function cleanIds(ids = []) {
  return [...new Set(ids.map((n) => Number(n)).filter(Number.isFinite))]
}
async function each(ids, fn) {
  let n = 0
  for (const id of cleanIds(ids)) if (await fn(id)) n += 1
  return n
}
const removeMany = (ids) => each(ids, remove)
const restoreMany = (ids) => each(ids, restore)
const purgeMany = (ids) => each(ids, purge)

// Kosongkan Sampah — hapus permanen semua isinya.
async function emptyTrash() {
  const { rowCount } = await query('delete from donations where deleted_at is not null')
  return rowCount
}

async function stats() {
  const { rows } = await query(`
    select
      count(*)::int as total,
      count(*) filter (where status = 'menunggu')::int as menunggu,
      count(*) filter (where status = 'terverifikasi')::int as terverifikasi,
      count(*) filter (where status = 'ditolak')::int as ditolak,
      count(*) filter (where source = 'program')::int as dari_program,
      count(*) filter (where source = 'tentang')::int as dari_tentang,
      -- Total donatur = orang yang punya minimal 1 donasi TERVERIFIKASI.
      -- Nama non-anonim dihitung unik; tiap donasi anonim dihitung 1 orang.
      (
        count(distinct donor_name) filter (where status = 'terverifikasi' and not anonymous)
        + count(*) filter (where status = 'terverifikasi' and anonymous)
      )::int as donatur,
      coalesce(sum(amount) filter (where status = 'terverifikasi'), 0)::bigint as total_terverifikasi,
      -- Dana terkumpul dipecah per sumber donasi.
      coalesce(sum(amount) filter (where status = 'terverifikasi' and source = 'program'), 0)::bigint as dana_program,
      coalesce(sum(amount) filter (where status = 'terverifikasi' and source = 'tentang'), 0)::bigint as dana_tentang,
      -- Isi Sampah (hanya jumlahnya — nominalnya TIDAK ikut dihitung).
      (select count(*)::int from donations where deleted_at is not null) as sampah
    from donations
    -- Yang ada di Sampah tidak ikut dihitung sama sekali.
    where deleted_at is null
  `)
  return rows[0]
}

module.exports = {
  STATUSES,
  SOURCES,
  create,
  list,
  jenisOptions,
  findProof,
  updateStatus,
  remove,
  removeMany,
  restore,
  restoreMany,
  purge,
  purgeMany,
  emptyTrash,
  stats,
}
