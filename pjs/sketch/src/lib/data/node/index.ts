import { clampAnd } from 'p5utils/src/lib/utils/calc'
import { BaseNode, NodeTerritory } from './types'
import { valueOrFn } from 'p5utils/src/lib/utils/utils'
import p5 from 'p5'

/**
 * create base properties of node
 * @param param0 initial 2d position x and y
 * @param angle
 * @param speed
 * @returns
 */
export const createBase = (
  [x, y] = [0, 0],
  angle = 0,
  speed = 100
): BaseNode => ({
  position: p.createVector(x, y),
  move: p5.Vector.fromAngle(p.radians(angle), speed),
})

/**
 * duplicate node inheriting properties
 * @param node
 * @returns
 */
export const duplicate = <Node extends BaseNode>(node: Node): Node => ({
  ...node,
  position: node.position.copy(),
  move: node.move.copy(),
})

/**
 * move node using its movement vector
 * @param node
 */
export const move = <Node extends BaseNode>(node: Node) => {
  node.position.add(node.move)
}

/**
 * restrain node's position within territory
 * @param territory
 */
export const restrain = <Node extends BaseNode>(
  node: Node,
  territory: NodeTerritory
) => {
  clampAnd(
    node.position.x,
    territory.l,
    territory.r
  )((val) => {
    node.position.set(val, node.position.y)
    node.move.rotate(180)
  })
  clampAnd(
    node.position.y,
    territory.t,
    territory.b
  )((val) => {
    node.position.set(node.position.x, val)
    node.move.rotate(180)
  })
}

/**
 * rotate node's movement angle
 * @param angle
 * @returns
 */
export const rotate = <Node extends BaseNode>(
  node: Node,
  angle: number | ((n: Node) => number)
) => {
  node.move.rotate(valueOrFn(node, angle))
}

/**
 * change node's movement speed
 * @param speed
 * @returns
 */
export const changeSpeed = <Node extends BaseNode>(
  node: Node,
  speed: number | ((n: Node) => number)
) => {
  node.move.setMag(valueOrFn(node, speed))
}

/**
 * mutate node's properties
 * @param node
 * @param newValues
 */
export const mutate = <Node extends BaseNode>(
  node: Node,
  newValues: Partial<Node>
) => {
  Object.assign(node, newValues)
}

/**
 * turn the state of node to 'dead',
 * mark it to be remoeved from data
 * @param node
 */
export const kill = (node: BaseNode) => {
  mutate(node, { dead: true })
}
