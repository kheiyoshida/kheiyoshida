import { DomainIntention } from '../../domain'
import { ScaffoldValues, calcConcreteScaffoldValues } from './draw/scaffold'

export type RenderPack = Omit<DomainIntention, 'scaffold'> & {
  scaffoldValues: ScaffoldValues
}

export const packRenderingInfo = (domain: DomainIntention): RenderPack => ({
  ...domain,
  scaffoldValues: calcConcreteScaffoldValues(domain.scaffold),
})
