import { RenderGrid } from '../../domain/compose/renderSpec'
import { MapInfo } from '../../domain/maze/mapper'
import { DomainIntention } from '../../domain'
import { ApplyColors, resolveColorIntention } from './color'

export type RenderPack = {
  renewColors: ApplyColors
  renderGrid: RenderGrid
  speed: number
  map: MapInfo
  visibility: number
}

export const packDomainIntention = ({
  colorIntention,
  renderGrid,
  speed,
  map,
  visibility
}: DomainIntention): RenderPack => {
  return {
    renewColors: resolveColorIntention(colorIntention),
    renderGrid,
    speed,
    map,
    visibility
  }
}
