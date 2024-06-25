import { SoundEffectBus, makeSoundEffectBus } from './bus'
import * as sounds from './sounds'

export const makeSoundEffectPack = (busConf?: SoundEffectBus) => {
  const walk = sounds.makeWalkSoundSource()
  const bus = makeSoundEffectBus([walk], busConf)
  return {
    bus,
    playWalk: () => walk.play()
  }
}
