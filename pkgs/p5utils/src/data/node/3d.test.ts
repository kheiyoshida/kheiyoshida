import p5 from 'p5'
import { createBase, move } from '.'
import { Position3D } from "../../3d/types"
import { createBase3D, restrain3D, restrain3dFromPosition, rotate3D } from './3d'
import { BaseNode3D } from './types'
import * as module3d from '../../3d'

beforeAll(() => {
  jest.spyOn(p, 'radians').mockImplementation((d) => (d * Math.PI) / 180)
})

test(`${createBase3D.name}`, () => {
  const spyFromAngles = jest.spyOn(p5.Vector, 'fromAngles')
  const node = createBase3D(new p5.Vector(0, 100, 0), { theta: 10, phi: 30 }, 10)
  expect(spyFromAngles.mock.calls[0]).toMatchInlineSnapshot(`
    [
      0.17453292519943295,
      0.5235987755982988,
      10,
    ]
  `)
})

test(`${restrain3D.name}`, () => {
  const node: BaseNode3D = { ...createBase([100, 0]), angles: { theta: 0, phi: 0 } }
  const sub = jest.spyOn(node.position, 'sub')
  restrain3D(node, 200)
  expect(sub).not.toHaveBeenCalled()
  restrain3D(node, 50)
  expect(sub).toHaveBeenCalled()
})

test(`${restrain3dFromPosition.name}`, () => {
  const initial: Position3D = [100, 100, 0]
  const node: BaseNode3D = createBase3D(new p5.Vector(...initial), { theta: 90, phi: 180 }, 60)
  const restrainFrom = restrain3dFromPosition(node)
  move(node)
  restrainFrom(initial, 100)
  expect(node.position.z).toBeCloseTo(-60)
  move(node)
  restrainFrom([100, 100, 0], 100)
  expect(node.position.z).toBeCloseTo(-60)
  expect(node.angles).toMatchObject({ theta: 270, phi: 180 })
})

test(`${rotate3D.name}`, () => {
  const node: BaseNode3D = { ...createBase(), angles: { theta: 0, phi: 0 } }
  jest.spyOn(node.move, 'mag').mockReturnValue(100)
  const fromAngles = jest.spyOn(module3d, 'vectorFromDegreeAngles')

  rotate3D(node, 90, 180)

  expect(node.angles).toMatchObject({ theta: 90, phi: 180 })
  expect(node.move.x).toBeCloseTo(0)
  expect(node.move.y).toBeCloseTo(0)
  expect(node.move.z).toBeCloseTo(-100)
  expect(fromAngles).toHaveBeenCalledWith(90, 180, 100)
})
