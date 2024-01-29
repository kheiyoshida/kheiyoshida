import p5 from 'p5'
import { loop3D, memorize } from 'utils'
import { drawAtPosition } from '../render/drawers/draw'

export const draw3DGrid = (numOfGrid = 3, size = 1000) => {
  const vectors = memorize(create3dGrid)(numOfGrid, size)
  vectors.forEach((v) => {
    p.text(v.array().toString(), v.x, v.y)
    drawAtPosition(v, () => p.sphere(10, 8, 8))
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
