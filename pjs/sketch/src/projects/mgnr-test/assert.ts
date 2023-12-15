
import * as Tone from 'tone'

export function assert(condition: boolean, message = 'something went wrong') {
  if (!condition) {
    beepAlert()
    throw Error(message)
  }
}

export function beepAlert() {
  Tone.Transport.pause()
  const beep = new Tone.Oscillator(800).toDestination()
  beep.start().stop('+0.1')
}
