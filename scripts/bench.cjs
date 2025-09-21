const http = require('node:http')

function gql(query, variables) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({ query, variables })
    const req = http.request(
      {
        hostname: 'localhost',
        port: 4000,
        path: '/graphql',
        method: 'POST',
        headers: { 'content-type': 'application/json', 'content-length': Buffer.byteLength(body) },
      },
      (res) => {
        const chunks = []
        res.on('data', (c) => chunks.push(c))
        res.on('end', () => {
          const text = Buffer.concat(chunks).toString('utf8')
          try { resolve(JSON.parse(text)) } catch (e) { reject(e) }
        })
      }
    )
    req.on('error', reject)
    req.write(body)
    req.end()
  })
}

async function main() {
  // warmup
  for (let i = 0; i < 10; i++) await gql('{ now }')

  const runs = 200
  const q = '{ random }'
  const t0 = performance.now()
  await Promise.all(Array.from({ length: runs }, () => gql(q)))
  const t1 = performance.now()
  const totalMs = t1 - t0
  console.log(`Ran ${runs} queries concurrently in ${totalMs.toFixed(1)} ms`) 
  console.log(`Avg per request (amortized): ${(totalMs / runs).toFixed(2)} ms`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
