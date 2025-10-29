import { DomainIntention } from '../../integration/query'
import { ScaffoldValues, calcConcreteScaffoldValues } from './scaffold_legacy'

export type RenderPack = DomainIntention & {
  scaffoldValues: ScaffoldValues
}

export const packRenderingInfo = (domain: DomainIntention): RenderPack => ({
  ...domain,
  scaffoldValues: calcConcreteScaffoldValues(domain.structure.scaffold),
})
