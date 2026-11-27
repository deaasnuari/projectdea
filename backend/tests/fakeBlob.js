// Server tiruan Vercel Blob API untuk tes: SDK asli @vercel/blob diarahkan ke sini
// lewat VERCEL_BLOB_API_URL. Mencatat setiap upload dan penghapusan.
const http = require('node:http')

const TOKEN = 'vercel_blob_rw_TESTSTORE_rahasiaTesJanganBocor123'
const PUBLIC_HOST = 'https://teststore.public.blob.vercel-storage.com'

async function startFakeBlob() {
  const state = { puts: [], deleted: [], fail: null } // fail = { status, code, message }
  const server = http.createServer((req, res) => {
    const chunks = []
    req.on('data', (c) => chunks.push(c))
    req.on('end', () => {
      const body = Buffer.concat(chunks)
      const url = new URL(req.url, 'http://x')
      const json = (status, data) => {
        res.writeHead(status, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify(data))
      }
      if (state.fail) return json(state.fail.status, { error: { code: state.fail.code, message: state.fail.message || state.fail.code } })
      if (req.method === 'POST' && url.pathname.endsWith('/delete')) {
        state.deleted.push(...JSON.parse(body.toString()).urls)
        return json(200, null)
      }
      if (req.method === 'PUT') {
        const pathname = url.searchParams.get('pathname')
        state.puts.push({ pathname, headers: req.headers, body })
        const publicUrl = `${PUBLIC_HOST}/${pathname}`
        return json(200, { url: publicUrl, downloadUrl: `${publicUrl}?download=1`, pathname, contentType: req.headers['x-content-type'], contentDisposition: 'inline', etag: '"x"' })
      }
      return json(404, { error: { code: 'not_found' } })
    })
  })
  await new Promise((r) => server.listen(0, r))
  const apiUrl = `http://localhost:${server.address().port}`
  return { state, apiUrl, close: () => server.close() }
}

module.exports = { startFakeBlob, TOKEN, PUBLIC_HOST }
