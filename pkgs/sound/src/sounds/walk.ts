import * as Tone from 'tone'
import { Channel, Filter } from 'tone'
import { SoundEffectSource } from './types'

export const makeWalkSoundSource = (): SoundEffectSource => {
  const noise = new Tone.MembraneSynth({
    envelope: {
      attack: 0,
      decay: 0.2,
      sustain: 0.05,
      release: 0.0,
    },
    detune: -200,
    volume: -6,
  })

  const filter = new Filter(2600, 'lowpass')
  const node = new Channel()

  noise.connect(filter)
  filter.connect(node)

  const play = () => {
    noise.triggerAttackRelease(40, 0.1, '+0.1')
  }
  return {
    node,
    play,
  }
}
