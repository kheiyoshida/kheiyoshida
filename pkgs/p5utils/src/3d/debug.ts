import p5 from 'p5'
import { loop3D, memorize } from 'utils'
import { vectorToSphericalAngles, toDegrees } from '.'
import { Camera } from '../camera/types'
import { Position3D } from "./types"
import { SphericalAngles } from "./types"
import { drawAtVectorPosition } from '../render'
import { pushPop } from '../render/utils'

export const draw3DGrid = (numOfGrid = 3, size = 1000, camera?: Camera) => {
  const vectors = memorize(create3dGrid)(numOfGrid, size)
  vectors.forEach((v) => {
    drawAtVectorPosition(v, () => {
      if (camera) {
        drawVectorPosition(camera.position, camera.forwardDir, v)
      }
      p.sphere(size / 100)
    })
  })
}

export const drawVectorPosition = (
  cameraPosition: Position3D,
  forwardDir: SphericalAngles,
  v: p5.Vector
) => {
  const relativeAngle = calcRelativeAngleFromPerspective(cameraPosition, forwardDir, v)
  pushPop(() => {
    adjustToPerspective(forwardDir)
    p.rotateY(relativeAngle.phi)
    p.rotateX(relativeAngle.theta)
    p.text(v.array().toString(), 0, 0)
  })
}

/**
 * rotate XY axis so that objects can face the camera's perspective
 */
export const adjustToPerspective = (forwardDir: SphericalAngles):void => {
  p.rotateX(forwardDir.theta - 90)
  p.rotateY(forwardDir.phi + 180)
}

export const calcRelativeAngleFromPerspective = (
  position: Position3D,
  forwardDir: SphericalAngles,
  target: p5.Vector
) => {
  const fromPositionToTarget = target.copy().sub(position)
  const [t, p] = vectorToSphericalAngles(fromPositionToTarget)
  const [targetTheta, targetPhi] = [toDegrees(t), toDegrees(p)]
  const relativeAngle = {
    theta: targetTheta - forwardDir.theta,
    phi: targetPhi - forwardDir.phi,
  }
  return relativeAngle
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
