const crypto = require('node:crypto')

// Hash password memakai scrypt bawaan Node (tanpa dependency tambahan).
// Format tersimpan: "scrypt$<salt hex>$<hash hex>".
function hashPassword(plain) {
  const salt = crypto.randomBytes(16).toString('hex')
  const hash = crypto.scryptSync(String(plain), salt, 64).toString('hex')
  return `scrypt$${salt}$${hash}`
}

function verifyPassword(plain, stored) {
  if (!stored || typeof stored !== 'string') return false
  const [algo, salt, hash] = stored.split('$')
  if (algo !== 'scrypt' || !salt || !hash) return false
  let test
  try {
    test = crypto.scryptSync(String(plain), salt, 64).toString('hex')
  } catch {
    return false
  }
  const a = Buffer.from(hash, 'hex')
  const b = Buffer.from(test, 'hex')
  return a.length === b.length && crypto.timingSafeEqual(a, b)
}

module.exports = { hashPassword, verifyPassword }
