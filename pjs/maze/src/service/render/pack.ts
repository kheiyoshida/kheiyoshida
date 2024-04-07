import { DomainIntention } from '../../domain'
import { ScaffoldLengths } from './scaffold'
import { calcAdjustedLength } from './scaffold/params'

export type RenderPack = Omit<DomainIntention, 'scaffold'> & {
  scaffold: {
    lengths: ScaffoldLengths
    distortion: number
  }
}

export const packRenderingInfo = (domain: DomainIntention): RenderPack => ({
  ...domain,
  scaffold: {
    lengths: calcAdjustedLength(domain.scaffold),
    distortion: domain.scaffold.distortionLevel,
  },
})
