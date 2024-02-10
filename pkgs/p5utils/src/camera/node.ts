import { changeSpeed, move } from '../data/node'
import { createBase3D, rotate3D } from '../data/node/3d'
import { CameraNode } from './types'
import { Position3D } from "../3d/types"

export const createCameraNode = (...args: Parameters<typeof createBase3D>): CameraNode => {
  const node = createBase3D(...args)
  return {
    setPosition(x, y, z) {
      node.position.set(x, y, z)
    },
    get position() {
      return node.position.array() as Position3D
    },
    setDirection(angles) {
      rotate3D(node, angles.theta, angles.phi)
    },
    setSpeed(speed) {
      changeSpeed(node, speed)
    },
    move() {
      move(node)
    },
  }
}
