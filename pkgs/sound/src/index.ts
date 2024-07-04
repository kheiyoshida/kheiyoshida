import { SoundEffectBus, makeSoundEffectBus } from './bus'
import * as sounds from './sounds'

export const makeSoundEffectPack = (busConf?: SoundEffectBus) => {
  const walk = sounds.makeWalkSoundSource()
  const stairs = sounds.makeStairsSoundSource()
  makeSoundEffectBus([walk, stairs], busConf)
  return {
    playWalk: () => walk.play(),
    playStairs: () => stairs.play()
  }
}
