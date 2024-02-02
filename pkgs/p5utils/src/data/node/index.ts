import p5 from 'p5'
import { clampAnd, valueOrFn } from 'utils'
import { BaseNode, NodeTerritory } from './types'

export const createBase = (
  [x, y] = [0, 0],
  angle = 0,
  speed = 100
): BaseNode => ({
  position: new p5.Vector(x, y),
  move: p5.Vector.fromAngle(p.radians(angle), speed),
})

export const duplicate = <Node extends BaseNode>(node: Node): Node => ({
  ...node,
  position: node.position.copy(),
  move: node.move.copy(),
})

export const move = <Node extends BaseNode>(node: Node) => {
  node.position.add(node.move)
}

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

export const rotate = <Node extends BaseNode>(
  node: Node,
  angle: number | ((n: Node) => number)
) => {
  node.move.rotate(valueOrFn(node, angle))
}

export const changeSpeed = <Node extends BaseNode>(
  node: Node,
  speed: number | ((n: Node) => number)
) => {
  node.move.setMag(valueOrFn(node, speed))
}

export const changeSpeedV2 = <Node extends BaseNode> (
  node: Node,
  speedChange: number | ((s: number) => number)
) => {
  if (typeof speedChange == 'number') {
    node.move.setMag(speedChange)
  } else {
    node.move.setMag(speedChange(node.move.mag()))
  }
}

export const mutate = <Node extends BaseNode>(
  node: Node,
  newValues: Partial<Node>
) => {
  Object.assign(node, newValues)
}

export const kill = (node: BaseNode) => {
  mutate(node, { dead: true })
}

export const distanceBetweenNodes = <Node extends BaseNode>(node: Node, node2: Node) => {
  return node.position.copy().sub(node2.position).mag()
}
