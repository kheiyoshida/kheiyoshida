import { DomainIntention } from '../../integration/query'
import { ScaffoldValues } from './scaffold/scaffold.ts'
import { translateScaffoldParams } from './scaffold/values.ts'

export type RenderPack = DomainIntention & {
  scaffoldValues: ScaffoldValues
}

export const packRenderingInfo = (domain: DomainIntention): RenderPack => ({
  ...domain,
  scaffoldValues: translateScaffoldParams(domain.structure.scaffold),
})
