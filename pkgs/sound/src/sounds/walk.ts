import { NoiseSynth } from 'tone'
import { SoundEffectSource } from './types'

export const makeWalkSoundSource = (): SoundEffectSource => {
  const node = new NoiseSynth({
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
  const play = () => {
    node.triggerAttackRelease(0.1)
  }
  return {
    node,
    play,
  }
}
