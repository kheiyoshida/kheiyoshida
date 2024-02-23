import p5 from 'p5'
import {
  sumPosition3d,
  vectorBetweenPositions
} from '../3d'
import { Position3D, SphericalAngles } from '../3d/types'
import { getCameraCenter, getForwardDirAngles, turnVectorByAngles } from './helpers'
import { createCameraNode } from './node'
import { Camera } from './types'

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
      keepFocus()
    },
    get position() {
      return node.position
    },
    setAbsoluteMoveDirection(angles) {
      node.setDirection(angles)
    },
    setRelativeMoveDirection(angles) {
      const currentLookinDirection = getForwardDirAngles(this.cameraCenter, node.position)
      const newDirection = {
        theta: currentLookinDirection.theta + angles.theta,
        phi: currentLookinDirection.phi + angles.phi,
      }
      node.setDirection(newDirection)
    },
    setMoveSpeed(speed) {
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
    get forwardDir(): SphericalAngles {
      return getForwardDirAngles(this.cameraCenter, node.position)
    },
    turnWithFocus(angles, focus) {
      const forward = vectorBetweenPositions(node.position, focus)
      const turned = turnVectorByAngles(forward, angles)
      const newFocus = sumPosition3d(node.position, turned.array() as Position3D)
      setFocus(newFocus)
    },
  }
}
