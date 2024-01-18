const STREAM_URL = 'localhost:8080'

export async function sendStream(log: Record<string, unknown>) {
  await fetch(`http://${STREAM_URL}`, {
    method: 'POST',
    body: JSON.stringify(log),
    headers: { 'Content-Type': 'application/json' },
  })
}
