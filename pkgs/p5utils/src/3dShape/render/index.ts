import { Geometry } from 'p5'
import { Position3D } from "../../3d/types"
import { VectorAngles } from '../../3d/types'
import { pushPop } from '../../utils'

export const renderGeometry = (geo: Geometry, position: number[], rotate?: VectorAngles): void => {
  pushPop(() => {
    p.translate(...position as Position3D)
    if (rotate) {
      p.rotateX(rotate.theta)
      p.rotateY(rotate.phi)
    }
    p.model(geo)
  })
}
