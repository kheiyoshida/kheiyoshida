import p5 from 'p5'
import { SphericalAngles } from 'p5utils/src/3d'
import { BaseNode3D } from 'p5utils/src/data/node/types'
import { shakyLineBetweenVectors3D } from 'p5utils/src/render'
import { pushPop, shakeVector3D } from 'p5utils/src/render'

export type MidiNode3D = BaseNode3D

export const createNode = (
  position: p5.Vector,
  angles: SphericalAngles = {
    theta: 0,
    phi: 0,
  },
  vel: number
): MidiNode3D => ({
  position,
  moveInDirection: p5.Vector.fromAngles(
    p.radians(angles.theta),
    p.radians(angles.phi),
    convertDurToSpeed(vel)
  ),
  angles,
})

export const convertDurToSpeed = (vel: number): number => {
  return vel
}

export const renderNode = (node: MidiNode3D) => {
  pushPop(() => {
    p.translate(node.position)
    p.sphere(4, 6, 6)
  })
  shakyLineBetweenVectors3D(new p5.Vector(), node.position, 2)
  pushPop(() => {
    p.translate(shakeVector3D(node.position, 2))
    p.sphere(4, 6, 6)
  })
}
