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

async function list({ status, source, jenis, limit = 200 } = {}) {
  const params = []
  const conds = []
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
            status, created_at
     from donations ${where}
     order by created_at desc
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
    where coalesce(jenis_label, jenis_id) is not null
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
    'select status, amount, program, source from donations where id = $1',
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

async function remove(id) {
  // Kalau donasi yang dihapus sudah terverifikasi & untuk program, kembalikan
  // dulu kontribusinya ke collected/donors program itu.
  const { rows: before } = await query(
    'select status, amount, program, source from donations where id = $1',
    [id],
  )
  if (!before[0]) return false
  const prev = before[0]

  const { rowCount } = await query('delete from donations where id = $1', [id])
  if (rowCount === 0) return false

  if (prev.source === 'program' && prev.program && prev.status === 'terverifikasi') {
    await query(
      `update programs
          set collected = greatest(0, collected - $2),
              donors = greatest(0, donors - 1),
              updated_at = now()
        where title = $1`,
      [prev.program, Math.round(Number(prev.amount) || 0)],
    )
  }
  return true
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
      coalesce(sum(amount) filter (where status = 'terverifikasi'), 0)::bigint as total_terverifikasi
    from donations
  `)
  return rows[0]
}

module.exports = { STATUSES, SOURCES, create, list, jenisOptions, findProof, updateStatus, remove, stats }
