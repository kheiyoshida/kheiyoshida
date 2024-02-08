import p5 from 'p5'
import { ShapeGraph } from '../types'
import { finalizeNodeSurfaces } from './node';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type pExtended = p5 & { beginGeometry: any; endGeometry: any }

export const finalizeGeometry = (shapeGraph: ShapeGraph): p5.Geometry => {
  // eslint-disable-next-line no-extra-semi
  ;(p as pExtended).beginGeometry()
  shapeGraph.forEach(finalizeNodeSurfaces)
  return (p as pExtended).endGeometry()
}
