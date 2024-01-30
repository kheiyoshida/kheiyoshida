import p5 from 'p5'
import { Camera } from './types'
import { createCameraNode } from './node'

export function createCamera(p5camera?: p5.Camera): Camera {
  const camera = p5camera || p.createCamera()
  const node = createCameraNode()
  return {
    setPosition: (x, y, z) => {
      node.setPosition(x, y, z)
      camera.setPosition(x, y, z)
    },
    get position() {
      return node.position
    },
    setDirection(angles) {
      node.setDirection(angles)
    },
    setSpeed(speed) {
      node.setSpeed(speed)
    },
    move() {
      node.move()
      camera.setPosition(...node.position)
    },
  }
}
