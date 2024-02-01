import p5 from 'p5'
import { valueOrFn } from 'utils'
import { distanceBetweenNodes, mutate } from '.'
import { BaseNode3D, VectorAngles } from './types'
import { toRadians } from '../../3d'

export const createBase3D = (
  position: p5.Vector = new p5.Vector(),
  angles: VectorAngles = {
    theta: 0,
    phi: 0,
  },
  speed: number = 1,
): BaseNode3D => ({
  position,
  move: p5.Vector.fromAngles(
    toRadians(angles.theta),
    toRadians(angles.phi),
    speed
  ),
  angles: angles,
})

/**
 * restrain node's position within territory
 * @param distance furthest distance that node can reach from the center (0,0,0)
 */
export const restrain3D = <Node extends BaseNode3D>(node: Node, distance: number) => {
  const distanceFromCenter = node.position.mag()
  if (distanceFromCenter > distance) {
    node.position.sub(node.move)
    rotate3D(node, node.angles.theta + 180, node.angles.phi)
  }
}

export const restrainFromNode = <Node extends BaseNode3D>(
  parent: Node,
  child: Node,
  distance: number
): boolean => {
  return distanceBetweenNodes(parent, child) > distance
}

/**
 * rotate node's movement angle.
 * note that theta can also rotate phi direction when it's over 180.
 * to reverse the direction, just add 180 to theta and zero to phi
 */
export const rotate3D = <Node extends BaseNode3D>(
  node: Node,
  theta: number | ((n: Node) => number),
  phi: number | ((n: Node) => number)
) => {
  const angles = {
    theta: valueOrFn(node, theta),
    phi: valueOrFn(node, phi),
  }
  mutate<BaseNode3D>(node, {
    angles,
    move: p5.Vector.fromAngles(p.radians(angles.theta), p.radians(angles.phi), node.move.mag()),
  })
}
