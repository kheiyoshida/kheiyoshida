import { makeSoundEffectBus } from './bus'
import * as sounds from './sounds'

export const makeSoundEffectPack = () => {
  const walk = sounds.makeWalkSoundSource()
  const bus = makeSoundEffectBus([walk])
  return {
    bus,
    playWalk: () => walk.play()
  }
}
