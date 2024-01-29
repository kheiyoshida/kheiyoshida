import { restrain3D, restrainFromNode, rotate3D } from './3d'
import { createBase } from '.'
import { BaseNode3D } from './types'
import p5 from 'p5'

jest.mock('p5')

beforeAll(() => {
  jest.spyOn(p, 'radians').mockReturnValue(3.14)
  jest.spyOn(p5.Vector, 'fromAngle').mockImplementation(() => new p5.Vector())
})

test(`${restrain3D.name}`, () => {
  const node: BaseNode3D = { ...createBase(), angles: { theta: 0, phi: 0 } }
  jest.spyOn(node.position, 'mag').mockReturnValueOnce(50).mockReturnValueOnce(200)
  const sub = jest.spyOn(node.position, 'sub')

  restrain3D(node, 100)
  expect(sub).not.toHaveBeenCalled()
  restrain3D(node, 100)
  expect(sub).toHaveBeenCalled()
})

test.todo(`${restrainFromNode.name}`)

test(`${rotate3D.name}`, () => {
  const node: BaseNode3D = { ...createBase(), angles: { theta: 0, phi: 0 } }
  jest.spyOn(p, 'radians').mockImplementation(d => d)
  jest.spyOn(node.move, 'mag').mockReturnValue(100)
  const newMove = new p5.Vector()
  const fromAngles = jest.spyOn(p5.Vector, 'fromAngles').mockReturnValue(newMove)

  rotate3D(node, 10, 20)
  
  expect(node.angles).toMatchObject({theta: 10, phi: 20})
  expect(node.move).toMatchObject(newMove)
  expect(fromAngles).toHaveBeenCalledWith(10,20, 100)
})