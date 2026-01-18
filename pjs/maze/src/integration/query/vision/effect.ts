import { makeDecreasingParameter, makeIncreasingParameter } from '../utils/params.ts'
import { game } from '../../../game'
import { EffectParams } from 'maze-gl'
import { logicalHeight, logicalWidth } from '../../../config'
import { Atmosphere } from '../../../game/world/types.ts'

type EffectType = Exclude<keyof EffectParams, 'time' | 'resolution'>

const AtmosphereEffectMap: Record<Atmosphere, EffectType[]> = {
  [Atmosphere.atmospheric]: ['fog', 'blur', 'distortion'],
  [Atmosphere.smooth]: ['fog', 'blur', 'distortion', 'edge'],
  [Atmosphere.ambient]: ['fog', 'blur', 'distortion', 'edge'],
  [Atmosphere.digital]: ['fog', 'blur', 'distortion', 'edge'],
  [Atmosphere.abstract]: ['fog', 'blur', 'edge'],
}

const distMagValues: Record<Atmosphere, number> = {
  [Atmosphere['atmospheric']]: 0.1,
  [Atmosphere['smooth']]: 0.2,
  [Atmosphere['ambient']]: 0.8,
  [Atmosphere['digital']]: 1.5,
  [Atmosphere['abstract']]: 0,
}

const edgeMagValues: Record<Atmosphere, number> = {
  [Atmosphere['atmospheric']]: 0.1,
  [Atmosphere['smooth']]: 0.1,
  [Atmosphere['ambient']]: 0.3,
  [Atmosphere['digital']]: 1,
  [Atmosphere['abstract']]: 1,
}

export const getEffectParams = (): EffectParams => {
  const { stamina, sanity } = game.player.status

  const params: EffectParams = {
    resolution: [logicalWidth, logicalHeight],
    time: performance.now(),
  }

  const atmosphere = game.maze.currentWorld!.atmosphere
  const enableEffects = AtmosphereEffectMap[atmosphere]

  for (const fx of enableEffects) {
    if (fx === 'fog') params.fog = { fogLevel: visibilityParam(stamina) }
    if (fx === 'blur') params.blur = { blurLevel: blurParameter(stamina) }
    if (fx === 'distortion') {
      params.distortion = { distortionLevel: pixelRandomizationParameter(sanity) * distMagValues[atmosphere] }
    }
    if (fx === 'edge') {
      params.edge = {
        edgeRenderingLevel: edgeRenderingParameter(sanity) * edgeMagValues[atmosphere],
      }
    }
  }

  return params
}

const blurParameter = makeIncreasingParameter(0, 5, 2000, 800)
const pixelRandomizationParameter = makeIncreasingParameter(0, 1, 2500, 750)
const edgeRenderingParameter = makeIncreasingParameter(0, 1, 3000, 1000)

// decrease visibility when stamina is low
const visibilityParam = makeDecreasingParameter(0, 1, 3000, 0)
