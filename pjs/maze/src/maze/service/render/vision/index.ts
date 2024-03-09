import { RenderGrid } from "../../../domain/compose/renderSpec"
import { MapInfo } from "../../../domain/maze/mapper"
import { VisionIntention } from "../../../domain/vision"
import { ApplyColors, resolveColorIntention } from "./color"
import { allInOneDrawer } from "./draw/drawers"
import { DrawSpec } from "./draw/types"
import { FinalizerMap } from "./drawSpec"
import { FinalizeDrawSpecs } from "./drawSpec/finalize"
import { consumeFrameMakerParams } from "./frame"
import { MakeFrames } from "./frame/framesMaker"

export type Vision = {
  makeFrames: MakeFrames
  draw: (specs: DrawSpec[][]) => void
  finalize: FinalizeDrawSpecs
  renewColors: ApplyColors
  renderGrid: RenderGrid,
  speed: number
  map: MapInfo
}

export const consumeVisionIntention = ({
  strategy,
  framesMakerParams,
  drawParams,
  colorIntention,
  renderGrid,
  speed,
  map
}: VisionIntention): Vision => {
  return {
    makeFrames: consumeFrameMakerParams(strategy, framesMakerParams),
    draw: allInOneDrawer(drawParams),
    finalize: FinalizerMap[strategy],
    renewColors: resolveColorIntention(colorIntention),
    renderGrid,
    speed,map
  }
}
