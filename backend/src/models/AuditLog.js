const { query } = require('../config/db')
const log = require('../lib/logger')

// Tabel dibuat otomatis kalau belum ada (db/schema.sql juga memuatnya), supaya
// fitur ini jalan tanpa harus menjalankan migrasi manual.
let ready
const ensure = () =>
  (ready ||= query(`create table if not exists audit_log (
    id bigserial primary key, at timestamptz not null default now(),
    actor text not null default '', action text not null,
    detail text not null default '', ip text not null default '')`).then(() =>
    query('create index if not exists audit_log_at_idx on audit_log (at desc)'),
  ))

const clip = (v, n) => String(v ?? '').replace(/[\u0000-\u001f\u007f]+/g, ' ').slice(0, n)

// Catat satu kejadian. Tidak pernah melempar error (log gagal tidak boleh
// menggagalkan aksi aslinya) dan tidak ditunggu pemanggil.
function record({ actor = '', action, detail = '', ip = '' }) {
  ensure()
    .then(() =>
      query('insert into audit_log (actor, action, detail, ip) values ($1,$2,$3,$4)', [
        clip(actor, 100), clip(action, 60), clip(detail, 300), clip(ip, 64),
      ]),
    )
    .catch((e) => log.error('audit', 'Gagal mencatat audit log', e))
}

async function list({ limit = 100, action } = {}) {
  await ensure()
  const lim = Math.min(Math.max(Number(limit) || 100, 1), 500)
  const params = []
  let where = ''
  if (action) { params.push(String(action)); where = 'where action = $1' }
  params.push(lim)
  const { rows } = await query(
    `select id, at, actor, action, detail, ip from audit_log ${where} order by at desc limit $${params.length}`,
    params,
  )
  return rows
}

async function countSince(action, hours = 24) {
  await ensure()
  const { rows } = await query(
    `select count(*)::int as n from audit_log where action = $1 and at > now() - ($2 || ' hours')::interval`,
    [action, String(Number(hours) || 24)],
  )
  return rows[0].n
}

module.exports = { record, list, countSince }
