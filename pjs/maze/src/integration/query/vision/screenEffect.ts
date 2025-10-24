import { Level } from '../utils/types.ts'
import { makeDecreasingParameter, makeIncreasingParameter } from '../utils/params.ts'
import { player } from '../../../game'

export type ScreenEffectParams = {
  blurLevel: Level
  pixelRandomizationLevel: Level
  edgeRenderingIntensityLevel: Level
}

export const getScreenEffectParams = (): ScreenEffectParams => {
  const { stamina, sanity } = player.status
  return {
    blurLevel: blurParameter(stamina),
    pixelRandomizationLevel: pixelRandomizationParameter(sanity),
    edgeRenderingIntensityLevel: edgeRenderingParameter(stamina + sanity),
  }
}

const blurParameter = makeIncreasingParameter(0, 1, 2500, 1200)
const pixelRandomizationParameter = makeIncreasingParameter(0, 1, 2500, 750)
const edgeRenderingParameter = makeDecreasingParameter(0, 1, 6000, 0)
