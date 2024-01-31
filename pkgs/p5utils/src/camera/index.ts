import p5 from 'p5'
import { createCameraNode } from './node'
import { Camera, Position3D } from './types'
import { getCameraCenter, getForwardDir } from './helpers'

export function createCamera(p5camera?: p5.Camera): Camera {
  const camera = p5camera || p.createCamera()
  const node = createCameraNode()
  let focus: Position3D | undefined
  function keepFocus() {
    if (!focus) return
    camera.lookAt(...focus)
  }
  function setFocus(position?: Position3D) {
    focus = position
  }

  return {
    setPosition: (x, y, z) => {
      node.setPosition(x, y, z)
      camera.setPosition(x, y, z)
    },
    get position() {
      return node.position
    },
    setAbsoluteDirection(angles) {
      node.setDirection(angles)
    },
    setRelativeDirection(angles) {
      const currentLookinDirection = getForwardDir(this.cameraCenter, node.position)
      const newDirection = {
        theta: currentLookinDirection.theta + angles.theta,
        phi: currentLookinDirection.phi + angles.phi,
      }
      node.setDirection(newDirection)
    },
    setSpeed(speed) {
      node.setSpeed(speed)
    },
    move() {
      node.move()
      camera.setPosition(...node.position)
      keepFocus()
    },
    setFocus,
    get focus() {
      return focus
    },
    turn(angles) {
      setFocus(undefined)
      camera.tilt(angles.theta)
      camera.pan(angles.phi)
    },
    get cameraCenter(): Position3D {
      return getCameraCenter(camera)
    },
  }
}
