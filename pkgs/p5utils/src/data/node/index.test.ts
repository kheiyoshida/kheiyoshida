import p5 from 'p5'
import { changeSpeed, createBase, duplicate, kill, move, mutate, restrain, rotate } from '.'

jest.mock('p5')

beforeAll(() => {
  jest.spyOn(p, 'radians').mockReturnValue(3.14)
  jest.spyOn(p5.Vector, 'fromAngle').mockImplementation(() => new p5.Vector())
})

test(`${createBase.name}`, () => {
  createBase([100, 100], 180, 100)
  expect(p5.Vector).toHaveBeenCalledWith(100, 100)
  expect(p5.Vector.fromAngle).toHaveBeenCalledWith(3.14, 100)
})

test(`${duplicate.name}`, () => {
  const node = createBase()
  duplicate(node)
  expect(node.position.copy).toHaveBeenCalled()
  expect(node.move.copy).toHaveBeenCalled()
})

test(`${move.name}`, () => {
  const node = createBase()
  move(node)
  expect(node.position.add).toHaveBeenCalledWith(node.move)
})

test(`${restrain.name}`, () => {
  const set = jest.fn()
  const rotate = jest.fn()
  const mockVector = jest.spyOn(p5, 'Vector').mockImplementation(
    () =>
      ({
        x: -10,
        y: 110,
        set,
        rotate,
      }) as unknown as p5.Vector
  )
  const node = createBase()

  restrain(node, {
    l: 0,
    r: 100,
    t: 0,
    b: 100,
  })
  expect(set.mock.calls[0][0]).toBe(0)
  expect(set.mock.calls[1][1]).toBe(100)
  expect(rotate).toHaveBeenCalledTimes(2)
  mockVector.mockReset()
})

test(`${rotate.name}`, () => {
  const node = createBase()
  rotate(node, 180)
  expect(node.move.rotate).toHaveBeenCalledWith(180)
})

test(`${changeSpeed.name}`, () => {
  const node = createBase()
  changeSpeed(node, 100)
  expect(node.move.setMag).toHaveBeenCalledWith(100)
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

