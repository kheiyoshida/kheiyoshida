import { Channel, Filter, MonoSynth, NoiseSynth } from 'tone'
import { randomFloatBetween, randomIntInAsymmetricRange } from 'utils'
import { SoundEffectSource } from './types'

export const makeWarpSoundSource = (): SoundEffectSource => {
  const syn = new MonoSynth({
    oscillator: {
      type: 'square10',
    },
    envelope: {
      attack: 0,
      decay: 0.5,
      sustain: 0.3,
      release: 0.2,
    },
    volume: -16,
    filter: {
      frequency: 300,
      type: 'lowpass',
    },
  })

  const filter = new Filter(100, 'highpass')
  const node = new Channel()

  syn.connect(filter)
  filter.connect(node)
  const play = () => {
    mapRandomPlayTime().forEach(([t1, t2]) => {
      syn.triggerAttackRelease(82 + randomIntInAsymmetricRange(0.5), t1, `+${t2}`)
    })
  }
  return {
    node,
    play,
  }
}

export const mapRandomPlayTime = (): [number, number][] => {
  const randomFloats = [...Array(7)].map(() => randomFloatBetween(0.05, 0.1))
  const enumerated = randomFloats.reduce((p, c) => [...p, p[p.length - 1] + c], [0])
  return [
    [enumerated[0], enumerated[1]],
    [enumerated[2], enumerated[3]],
    [enumerated[4], enumerated[5]],
    [enumerated[6], enumerated[7]],
  ]
}
