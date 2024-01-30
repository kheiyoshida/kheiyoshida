import p5 from 'p5'
import { loop3D, memorize } from 'utils'
import { revertToSphericalCoordinate } from '../3d'
import { Position3D } from '../camera/types'
import { drawAtPosition } from '../render/drawers/draw'
import { pushPop } from '../utils'

export const draw3DGrid = (
  numOfGrid = 3,
  size = 1000,
  cameraPosition?: Position3D,
  cameraCenter?: Position3D
) => {
  const vectors = memorize(create3dGrid)(numOfGrid, size)
  vectors.forEach((v) => {
    drawAtPosition(v, () => {
      if (cameraCenter) {
        const toV = v.copy().sub(...cameraCenter)
        const [theta, phi] = revertToSphericalCoordinate(toV)
        pushPop(() => {
          p.rotateX(p.degrees(theta))
          p.rotateY(p.degrees(phi))
          p.text(v.array().toString(), 0, 0)
        })
      } else {
        p.text(v.array().toString(), 0, 0)
      }
      p.sphere(size / 100)
    })
  })
}

export const create3dGrid = (numOfGrid: number, size: number) => {
  const vectors: p5.Vector[] = []
  const sizeBetween = (2 * size) / (numOfGrid - 1)
  loop3D(numOfGrid, (x, y, z) => {
    vectors.push(
      new p5.Vector(-size + x * sizeBetween, -size + y * sizeBetween, -size + z * sizeBetween)
    )
  })
  return vectors
}
