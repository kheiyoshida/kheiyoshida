import * as Tone from 'tone'
import { SoundEffectSource } from './sounds'

export interface SoundEffectBus {
  volume: number
  echoLevel: Tone.Unit.Time
}

export const makeSoundEffectBus = (
  soundSources: SoundEffectSource[],
  conf: SoundEffectBus = {
    volume: -10,
    echoLevel: 0.01,
  }
): SoundEffectBus => {
  const echo = new Tone.Reverb(conf.echoLevel as number)
  const out = new Tone.Channel(conf.volume)
  echo.connect(out)
  out.toDestination()

  soundSources.forEach((source) => {
    const node = source.node
    node.connect(echo)
    node.connect(out)
  })

  return {
    get volume() {
      return out.volume.value
    },
    set volume(v: number) {
      out.volume.value = v
    },
    get echoLevel() {
      return echo.get().decay
    },
    set echoLevel(l: number) {
      echo.set({
        decay: l,
      })
    },
  }
}
