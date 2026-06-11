const HOP_BY_HOP_HEADERS = new Set([
  "connection",
  "content-length",
  "host",
  "keep-alive",
  "proxy-authenticate",
  "proxy-authorization",
  "te",
  "trailer",
  "transfer-encoding",
  "upgrade",
])

function getBackendUrl() {
  const backendUrl = process.env.VITE_API_BACKEND ?? process.env.API_BACKEND

  if (!backendUrl) {
    throw new Error("VITE_API_BACKEND is not configured")
  }

  return backendUrl.replace(/\/$/, "")
}

function getRequestBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = []

    req.on("data", (chunk) => chunks.push(chunk))
    req.on("end", () => resolve(chunks.length ? Buffer.concat(chunks) : undefined))
    req.on("error", reject)
  })
}

function copyHeaders(headers) {
  const result = {}

  for (const [name, value] of Object.entries(headers)) {
    if (!HOP_BY_HOP_HEADERS.has(name.toLowerCase()) && value !== undefined) {
      result[name] = value
    }
  }

  return result
}

export default async function handler(req, res) {
  try {
    const backendUrl = getBackendUrl()
    const incomingUrl = new URL(req.url ?? "/", `https://${req.headers.host ?? "localhost"}`)
    const targetUrl = new URL(`${backendUrl}${incomingUrl.pathname}`)

    targetUrl.search = incomingUrl.search

    const body = ["GET", "HEAD"].includes(req.method ?? "")
      ? undefined
      : await getRequestBody(req)

    const response = await fetch(targetUrl, {
      method: req.method,
      headers: copyHeaders(req.headers),
      body,
      redirect: "manual",
    })

    res.statusCode = response.status
    response.headers.forEach((value, name) => {
      if (!HOP_BY_HOP_HEADERS.has(name.toLowerCase())) {
        res.setHeader(name, value)
      }
    })

    const responseBody = Buffer.from(await response.arrayBuffer())
    res.end(responseBody)
  } catch (error) {
    console.error("[api-proxy]", error)
    res.statusCode = 502
    res.setHeader("content-type", "application/json")
    res.end(JSON.stringify({ message: "API proxy error" }))
  }
}
