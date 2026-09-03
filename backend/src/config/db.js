const { Pool } = require('pg')

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 10,
  idleTimeoutMillis: 30_000,
})

const query = (text, params) => pool.query(text, params)

module.exports = { pool, query }
