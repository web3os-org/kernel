export const name = 'ping'
export const version = '0.1.0'
export const description = 'Ping a host'
export const help = `
  Note: this utility uses TCP/HTTP rather than ICMP
        and shows incorrect times when blocked/failed/invalid hosts

  Usage:
    ping <host>
`

export async function run (term, host) {
  if (!host || host === '') return
  term.log(`Pinging ${host}...`)
  const start = Date.now()

  try {
    await fetch(`https://${host}`)
  } catch {
  } finally {
    const end = Date.now()
    term.log(`${end - start}ms`)
  }
}
