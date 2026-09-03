require('dotenv').config()

const { pool } = require('../src/config/db')

;(async () => {
  try {
    const { rows: before } = await pool.query('select count(*)::int as n from donations')
    await pool.query('truncate donations restart identity')
    console.log(`✓ ${before[0].n} baris donasi dihapus. Tabel donations sekarang kosong.`)
  } catch (err) {
    console.error('✗ gagal:', err.message)
    process.exitCode = 1
  } finally {
    await pool.end()
  }
})()
