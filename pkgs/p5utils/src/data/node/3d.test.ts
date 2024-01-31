import p5 from 'p5'
import { createBase } from '.'
import { createBase3D, restrain3D, restrainFromNode, rotate3D } from './3d'
import { BaseNode3D } from './types'

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

test.todo(`${restrainFromNode.name}`)

test(`${rotate3D.name}`, () => {
  const node: BaseNode3D = { ...createBase(), angles: { theta: 0, phi: 0 } }
  jest.spyOn(p, 'radians').mockImplementation((d) => d)
  jest.spyOn(node.move, 'mag').mockReturnValue(100)
  const newMove = new p5.Vector()
  const fromAngles = jest.spyOn(p5.Vector, 'fromAngles').mockReturnValue(newMove)

  rotate3D(node, 10, 20)

  expect(node.angles).toMatchObject({ theta: 10, phi: 20 })
  expect(node.move).toMatchObject(newMove)
  expect(fromAngles).toHaveBeenCalledWith(10, 20, 100)
})