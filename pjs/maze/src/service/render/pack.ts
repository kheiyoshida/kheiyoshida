import { DomainIntention } from "../../domain";
import { ScaffoldLengths } from "./scaffold";
import { calcAdjustedLength } from "./scaffold/params";

export type RenderPack = Omit<DomainIntention, 'scaffold'> & {
  scaffoldLengths: ScaffoldLengths
}

export const packRenderingInfo = (domain: DomainIntention): RenderPack => ({
  ...domain,
  scaffoldLengths: calcAdjustedLength(domain.scaffold)
})
