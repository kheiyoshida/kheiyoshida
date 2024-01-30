import p5 from 'p5'
import {
  changeSpeed,
  createBase,
  distanceBetweenNodes,
  duplicate,
  kill,
  move,
  mutate,
  restrain,
  rotate,
} from '.'
import { BaseNode } from './types'

beforeAll(() => {
  jest.spyOn(p, 'radians').mockReturnValue(3.14)
})

test(`${createBase.name}`, () => {
  const fromAngle = jest.spyOn(p5.Vector, 'fromAngle')
  const node = createBase([100, 100], 180, 100)
  expect(node.position.array()).toMatchObject([100, 100, 0])
  expect(fromAngle).toHaveBeenCalledWith(3.14, 100)
})

test(`base node can be bound with functions`, () => {
  const createCustom = (node: BaseNode) => {
    return {
      node,
      rotate: (angle: number) => rotate(node, angle),
      move: () => move(node),
      duplicate: () => createCustom(duplicate(node)),
    }
  }
  const createCustomizedNode = (...args: Parameters<typeof createBase>) => {
    const node = createBase(...args)
    return createCustom(node)
  }

  const custom = createCustomizedNode([0, 0], 0, 100)
  const ro = jest.spyOn(custom.node.move, 'rotate')
  custom.rotate(90)
  expect(ro).toHaveBeenCalledWith(90)

  const dupe = custom.duplicate()
  custom.move()
  expect(custom.node.position.array()).not.toMatchObject([0, 0, 0])
  expect(dupe.node.position.array()).toMatchObject([0, 0, 0])
})

test(`${duplicate.name}`, () => {
  const node = createBase()
  const dupe = duplicate(node)
  expect(node.position.array()).toMatchObject(dupe.position.array())
  expect(node.move.array()).toMatchObject(dupe.move.array())
})

test(`${move.name}`, () => {
  jest.spyOn(p, 'radians').mockReturnValue(0)
  const node = createBase([0, 0], 0, 100)
  move(node)
  expect(node.position.array()).toMatchObject([100, 0, 0])
})

test(`${restrain.name}`, () => {
  const node = createBase([-10, 110])
  const set = jest.spyOn(node.position, 'set')
  const rotate = jest.spyOn(node.move, 'rotate')
  restrain(node, {
    l: 0,
    r: 100,
    t: 0,
    b: 100,
  })
  expect(set.mock.calls[0]).toMatchObject([0, 110])
  expect(set.mock.calls[1]).toMatchObject([0, 100])
  expect(rotate).toHaveBeenCalledTimes(2)
})

test(`${rotate.name}`, () => {
  const node = createBase()
  const ro = jest.spyOn(node.move, 'rotate')
  rotate(node, 180)
  expect(ro).toHaveBeenCalledWith(180)
})

test(`${changeSpeed.name}`, () => {
  const node = createBase()
  const setMag = jest.spyOn(node.move, 'setMag')
  changeSpeed(node, 100)
  expect(setMag).toHaveBeenCalledWith(100)
})

test(`${mutate.name}`, () => {
  const node = createBase()
  const newPos = new p5.Vector()
  mutate(node, { position: newPos })
  expect(node.position).toMatchObject(newPos)
})

test(`${kill.name}`, () => {
  const node = createBase()
  kill(node)
  expect(node.dead).toBe(true)
})

test(`${distanceBetweenNodes.name}`, () => {
  const node1 = createBase([0, 0])
  const node2 = createBase([0, 100])
  expect(distanceBetweenNodes(node1, node2)).toBe(100)
  expect(node1.position.array()).toMatchObject([0, 0, 0])
  expect(node2.position.array()).toMatchObject([0, 100, 0])
})
