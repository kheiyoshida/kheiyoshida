import { LogData } from 'stream/src/types'
import { CliScale } from './wrappers'
import { MidiChOutletPort } from 'mgnr-midi/src/Outlet'
import { Range } from 'utils'

export function setupLogStream(ports: MidiChOutletPort<any>[], scales: CliScale[]) {
  let time = 0
  const interval = 250
  setInterval(() => {
    time += interval
    sendStream({
      head: msToMinutesSeconds(time),
      body: {
        p: ports.map((p) => {
          return {
            _: '',
            l: p.generator.sequence.length,
            n: p.generator.sequence.numOfNotes,
            den: p.generator.sequence.density,
            dur: convertRange(p.generator.picker.duration),
            vel: convertRange(p.generator.picker.velocity),
            f: p.generator.sequence.conf.fillStrategy,
            p: p.generator.sequence.poly ? 'poly' : 'mono',
            h: p.generator.picker.harmonizer ? p.generator.picker.harmonizer['degree'] : '',
          }
        }),
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

function convertRange(r: Range | number) {
  if (typeof r === 'number') return r
  else return `${r.min}-${r.max}`
}
