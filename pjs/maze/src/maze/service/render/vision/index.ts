import { VisionIntention, getVisionIntentionFromCurrentState } from "../../../domain/vision"
import { ApplyColors, resolveColorIntention } from "./color"
import { allInOneDrawer } from "./draw/drawers"
import { DrawSpec } from "./draw/types"
import { FinalizerMap } from "./drawSpec"
import { DrawSpecFinalizer } from "./drawSpec/finalize"
import { consumeFrameMakerParams } from "./frame"
import { FramesMaker } from "./frame/framesMaker"

export type Vision = {
  frames: FramesMaker
  draw: (specs: DrawSpec[][]) => void
  finalize: DrawSpecFinalizer
  renewColors: ApplyColors
}

export const getVisionFromCurrentState = (): Vision => {
  const visionIntention = getVisionIntentionFromCurrentState()
  return consumeVisionIntention(visionIntention)
}

export const consumeVisionIntention = ({
  strategy,
  framesMakerParams,
  drawParams,
  colorIntention,
}: VisionIntention): Vision => {
  return {
    frames: consumeFrameMakerParams(strategy, framesMakerParams),
    draw: allInOneDrawer(drawParams),
    finalize: FinalizerMap[strategy],
    renewColors: resolveColorIntention(colorIntention),
  }
}
