import { Geometry } from 'p5'
import { Position3D } from '../../3d/types'
import { VectorAngles } from '../../3d/types'
import { pushPop } from '../../utils'

export const renderGeometry = (geo: Geometry, position: number[], rotate?: VectorAngles): void => {
  pushPop(() => {
    p.translate(...(position as Position3D))
    if (rotate) {
      p.rotateY(rotate.phi)
      p.rotateX(-rotate.theta)
    }
    model(geo)
  })
}

const model = (geo: Geometry) => {
  try {
    p.model(geo)
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn(e)
    throw new RenderGeometryError()
  }
}

/**
 * thrown when p5 gets confused by closely placed vertices.
 * just try to make the geometry with another pattern in that case.
 */
export class RenderGeometryError extends Error {
  constructor() {
    super(`RenderGeometryError: seems p5 could not sort out the vertices, why don't you try with another pattern? `)
  }
}
