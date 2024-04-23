import p5 from 'p5'
import { Position3D, sumPosition3d } from 'p5utils/src/3d'
import { finalizeSurface } from 'p5utils/src/3dShape/finalize/surface'
import { GeometrySpec, ShapeCoordinates } from '../types'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type pExtended = p5 & { beginGeometry: any; endGeometry: any }

export const finalizeGeometries = (geoSpecList: GeometrySpec[]): p5.Geometry[] =>
  geoSpecList.flatMap(finalizeGeometry)

export const finalizeGeometry = (geoSpec: GeometrySpec): p5.Geometry[] => {
  return geoSpec.map((coords) => {
    // eslint-disable-next-line no-extra-semi
    ;(p as pExtended).beginGeometry()
    finalizeShape(coords)
    return (p as pExtended).endGeometry()
  })
}

const finalizeShape = (coords: ShapeCoordinates): void => {
  if (coords.length < 4) throw Error(`must be coords of four or more`)
  const blockCenter = new p5.Vector()
  const shapeCenter = new p5.Vector(...calcAverage(coords))
  const vectors = coords.map((c) => new p5.Vector(...c))
  const triangles = separateIntoTriangles(vectors, shapeCenter)
  triangles.forEach((tri) => finalizeSurface(tri, blockCenter))
}

const calcAverage = (coords: ShapeCoordinates): Position3D => {
  return sumPosition3d(...coords).map((v) => v / coords.length) as Position3D
}

const separateIntoTriangles = (shapeVectors: p5.Vector[], center: p5.Vector): p5.Vector[][] => {
  return shapeVectors.map((v, i) => [v, shapeVectors[i + 1] || shapeVectors[0], center])
}
