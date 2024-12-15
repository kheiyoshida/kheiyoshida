import { SoundEffectBus, makeSoundEffectBus } from './bus'
import * as sounds from './sounds'

export const makeSoundEffectPack = (busConf?: SoundEffectBus) => {
  const walk = sounds.makeWalkSoundSource()
  const stairs = sounds.makeWarpSoundSource()
  const lift = sounds.makeLiftSoundSource()
  makeSoundEffectBus([walk, stairs, lift], busConf)
  return {
    playWalk: () => walk.play(),
    playWarp: () => stairs.play(),
    playLift: () => lift.play(),
  }
}
