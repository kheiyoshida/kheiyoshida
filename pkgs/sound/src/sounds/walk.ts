import { Channel, Filter, NoiseSynth } from 'tone'
import { SoundEffectSource } from './types'

export const makeWalkSoundSource = (): SoundEffectSource => {
  const noise = new NoiseSynth({
    noise: {
      type: 'brown',
    },
    envelope: {
      attack: 0,
      decay: 0.05,
      sustain: 0.1,
      release: 0.1,
    },
  })
  const filter = new Filter(2600, 'lowpass')
  const node = new Channel()
  noise.connect(filter)
  filter.connect(node)
  const play = () => {
    noise.triggerAttackRelease(0.1)
  }
  return {
    node,
    play,
  }
}
