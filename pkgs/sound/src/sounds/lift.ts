import * as Tone from 'tone'
import { Channel, Filter } from 'tone'
import { SoundEffectSource } from './types'
import { mapRandomPlayTime } from './warp'

export const makeLiftSoundSource = (): SoundEffectSource => {
  const synth = new Tone.NoiseSynth({
    noise: {
      type: 'pink',
    },
    envelope: {
      attack: 0,
      decay: 1,
      sustain: 1.0,
      release: 0.0,
    },
    volume: -6,
  })

  const filter = new Filter(300, 'lowpass')
  const node = new Channel()

  synth.connect(filter)
  filter.connect(node)

  const play = () => {
    mapRandomPlayTime().forEach(([t1, t2]) => {
      synth.triggerAttackRelease(t1, `+${t2}`)
    })
  }
  return {
    node,
    play,
  }
}
