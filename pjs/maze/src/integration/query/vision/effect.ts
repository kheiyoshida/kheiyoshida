import { makeDecreasingParameter, makeIncreasingParameter } from '../utils/params.ts'
import { game } from '../../../game'
import { EffectParams } from 'maze-gl'
import { logicalHeight, logicalWidth } from '../../../config'

export const getEffectParams = (): EffectParams => {
  const { stamina, sanity } = game.player.status

  const params: EffectParams = {
    resolution: [logicalWidth, logicalHeight],
    time: performance.now(),

  }

  // todo: switch based on atmosphere
  const atmosphere = game.maze.currentWorld!.atmosphere
  params.edge = {
    // edgeRenderingLevel: edgeRenderingParameter(stamina + sanity),
    edgeRenderingLevel: 1,
  }

  params.fog = {
    // fogLevel: visibilityParam(stamina)
    fogLevel: 1,
  }

  params.blur = {
    // blurLevel: blurParameter(stamina)
    blurLevel: 1,
  }

  // params.distortion = {
  //   // distortionLevel: pixelRandomizationParameter(sanity),
  //   distortionLevel: 0.3,
  // }

  return params
}

const blurParameter = makeIncreasingParameter(0, 1, 2500, 1200)
const pixelRandomizationParameter = makeIncreasingParameter(0, 1, 2500, 750)
const edgeRenderingParameter = makeDecreasingParameter(0, 1, 6000, 0)

// decrease visibility when stamina is low
const visibilityParam = makeDecreasingParameter(0, 1, 2500, 1000)
