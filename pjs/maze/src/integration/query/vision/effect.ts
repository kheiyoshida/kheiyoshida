import { makeDecreasingParameter, makeIncreasingParameter } from '../utils/params.ts'
import { game } from '../../../game'
import { EffectParams } from 'maze-gl'
import { logicalHeight, logicalWidth } from '../../../config'
import { Atmosphere } from '../../../game/world/types.ts'

type EffectType = Exclude<keyof EffectParams, 'time' | 'resolution'>

const AtmosphereEffectMap: Record<Atmosphere, EffectType[]> = {
  [Atmosphere.atmospheric]: ['fog', 'blur'],
  [Atmosphere.smooth]: ['fog', 'blur'],
  [Atmosphere.ambient]: ['fog', 'blur', 'distortion'],
  [Atmosphere.digital]: ['fog', 'blur', 'distortion', 'edge'],
  [Atmosphere.abstract]: ['fog', 'blur', 'edge'],
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
    if (fx === 'distortion') params.distortion = { distortionLevel: pixelRandomizationParameter(sanity) }
    if (fx === 'edge') params.edge = { edgeRenderingLevel: edgeRenderingParameter(stamina + sanity) }
  }

  return params
}

const blurParameter = makeIncreasingParameter(0, 5, 2000, 800)
const pixelRandomizationParameter = makeIncreasingParameter(0, 1, 2500, 750)
const edgeRenderingParameter = makeDecreasingParameter(0, 1, 6000, 0)

// decrease visibility when stamina is low
const visibilityParam = makeDecreasingParameter(0, 1, 2500, 1000)
