require('dotenv').config()

const fs = require('node:fs')
const path = require('node:path')
const { pool } = require('../src/config/db')

const reset = process.argv.includes('--reset')

;(async () => {
  try {
    if (reset) {
      await pool.query('drop table if exists site_content')
      console.log('· tabel lama dihapus (--reset)')
    }
    const sql = fs.readFileSync(path.join(__dirname, '..', 'db', 'schema.sql'), 'utf8')
    await pool.query(sql)
    console.log('✓ migrasi selesai')
  } catch (err) {
    console.error('✗ migrasi gagal:', err.message)
    process.exitCode = 1
  } finally {
    await pool.end()
  }
})()
