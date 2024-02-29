import * as Tone from 'tone'
import { demo } from './songs/demo'

export const music = () => {
  demo()

  return () => {
    Tone.start()
    Tone.Transport.start()
  }
}
