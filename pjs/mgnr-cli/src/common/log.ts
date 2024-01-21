import { LogData } from 'stream/src/types'
import { CliScale, CliSequenceGenerator } from './wrappers'

export function setupLogStream(generators: CliSequenceGenerator[], scales: CliScale[]) {
  let time = 0
  const interval = 250
  setInterval(() => {
    time += interval
    sendStream({
      head: msToMinutesSeconds(time),
      body: {
        g: generators.map((g) => g.logState()),
        s: scales.map((s) => s.logState()),
      },
    })
  }, interval)
}

const STREAM_URL = 'http://localhost:8080/log'
export async function sendStream(log: LogData) {
  await fetch(STREAM_URL, {
    method: 'POST',
    body: JSON.stringify(log),
    headers: { 'Content-Type': 'application/json' },
  })
}

function msToMinutesSeconds(millis: number) {
  const minutes = Math.floor(millis / 60_000).toString()
  const seconds = ((millis % 60_000) / 1000).toFixed()
  return `${zeroFill(minutes)}:${zeroFill(seconds)}`
}

function zeroFill(t: string) {
  return t.length === 1 ? `0${t}` : t
}
