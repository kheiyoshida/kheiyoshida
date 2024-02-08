import p5 from "p5"
import { calculateVertices, createInitialNode } from "p5utils/src/data/shape/create"
import { geometryFromShape } from "p5utils/src/render/shape"

const createStaticNode = (position: p5.Vector, distanceFromNode: number) => {
  return createInitialNode(
    {
      position,
      move: new p5.Vector(),
      angles: {
        theta: 0,
        phi: 0,
      },
    },
    { distanceFromNode }
  )
}

export const generateGeometry = (): p5.Geometry => {
  const node = createStaticNode(new p5.Vector(), 30)
  const shape = calculateVertices([node])
  return geometryFromShape(shape)
}

export const renderShape = (geo: p5.Geometry) => {
  p.model(geo)
}