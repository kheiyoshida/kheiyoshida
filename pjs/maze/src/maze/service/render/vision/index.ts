import { RenderGrid } from '../../../domain/compose/renderSpec'
import { MapInfo } from '../../../domain/maze/mapper'
import { DomainIntention } from '../../../domain'
import { ApplyColors, resolveColorIntention } from './color'

export type RenderPack = {
  renewColors: ApplyColors
  renderGrid: RenderGrid
  speed: number
  map: MapInfo
}

export const packVisionIntention = ({
  colorIntention,
  renderGrid,
  speed,
  map,
}: DomainIntention): RenderPack => {
  return {
    renewColors: resolveColorIntention(colorIntention),
    renderGrid,
    speed,
    map,
  }
}
