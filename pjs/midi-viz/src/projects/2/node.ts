import p5 from 'p5'
import { BaseNode3D, VectorAngles } from 'p5utils/src/lib/data/node/types'
import { shakyLineBetweenVectors3D } from 'p5utils/src/lib/render/drawers/draw'
import { pushPop, shakeVector3D } from 'p5utils/src/lib/utils/p5utils'

export type MidiNode3D = BaseNode3D

export const createNode = (
  position: p5.Vector,
  angles: VectorAngles = {
    theta: 0,
    phi: 0,
  },
  vel: number
): MidiNode3D => ({
  position,
  move: p5.Vector.fromAngles(
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
