import { GeometrySpec } from './types'

export type GeometryProcessor = (input: GeometrySpec) => GeometrySpec

export function runPipeline(geometry: GeometrySpec, steps: GeometryProcessor[]): GeometrySpec {
  return steps.reduce((geo, fn) => fn(geo), geometry)
}
