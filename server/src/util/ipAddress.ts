import { networkInterfaces } from "os"

export default function ipAddresses() {
  const nets = networkInterfaces()
  const results: string[] = []

  for (const name of Object.keys(nets)) {
    if (nets[name]) {
      for (const net of nets[name]) {
        // Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
        // 'IPv4' is in Node <= 17, from 18 it's a number 4 or 6
        const familyV4Value = typeof net.family === "string" ? "IPv4" : 4
        if (net.family === familyV4Value && !net.internal) {
          results.push(net.address)
        }
      }
    }
  }

  return results
}