#!/usr/bin/env node
/**
 * 1. Reads UMI_APP_TIKTOK_CLIENT_KEY from .env.local
 * 2. Starts a redirect proxy on port 8001 → localhost:8000/tiktok
 *    (because ttdx constructs minis_url as http://host:port with no path)
 * 3. Injects clientKey + port:8001 into minis.config.json temporarily
 * 4. Runs ttdx minis debug
 */
const fs = require('fs')
const path = require('path')
const http = require('http')
const { spawn } = require('child_process')

const root = path.resolve(__dirname, '..')
const configPath = path.join(root, 'minis.config.json')
const envPath = path.join(root, '.env.local')
const PROXY_PORT = 8001
const DEV_PORT = 8000
const ENTRY = '/tiktok'

// Load .env.local
let clientKey = process.env.UMI_APP_TIKTOK_CLIENT_KEY || ''
if (!clientKey && fs.existsSync(envPath)) {
  const lines = fs.readFileSync(envPath, 'utf-8').split('\n')
  for (const line of lines) {
    const match = line.match(/^UMI_APP_TIKTOK_CLIENT_KEY="?([^"\n]+)"?/)
    if (match) {
      clientKey = match[1]
      break
    }
  }
}

if (!clientKey) {
  console.error(
    'Error: UMI_APP_TIKTOK_CLIENT_KEY not found in env or .env.local'
  )
  process.exit(1)
}

// Redirect server: GET / → 302 to /tiktok so React Router sees the correct path
const proxy = http.createServer((req, res) => {
  if (req.url === '/') {
    res.writeHead(302, { Location: ENTRY })
    res.end()
    return
  }
  const options = {
    hostname: 'localhost',
    port: DEV_PORT,
    path: req.url,
    method: req.method,
    headers: { ...req.headers, host: `localhost:${DEV_PORT}` },
  }
  const proxyReq = http.request(options, proxyRes => {
    res.writeHead(proxyRes.statusCode, proxyRes.headers)
    proxyRes.pipe(res, { end: true })
  })
  req.pipe(proxyReq, { end: true })
  proxyReq.on('error', () => {
    res.writeHead(502)
    res.end('Dev server not running on port ' + DEV_PORT)
  })
})

proxy.listen(PROXY_PORT, () => {
  console.log(
    `Proxy: http://localhost:${PROXY_PORT} → http://localhost:${DEV_PORT}${ENTRY}`
  )
})

// Patch minis.config.json temporarily
const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'))
const original = JSON.stringify(config, null, 2)
const merged = {
  ...config,
  dev: { ...config.dev, port: String(PROXY_PORT), clientKey },
}
fs.writeFileSync(configPath, JSON.stringify(merged, null, 2))

const child = spawn('ttdx', ['minis', 'debug'], { cwd: root, stdio: 'inherit' })

const cleanup = () => {
  fs.writeFileSync(configPath, original)
  proxy.close()
}

child.on('exit', cleanup)
process.on('SIGINT', () => {
  child.kill()
  cleanup()
  process.exit()
})
process.on('SIGTERM', () => {
  child.kill()
  cleanup()
  process.exit()
})
