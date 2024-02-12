import p5 from 'p5'
import { calcNormal, finalizeSurface } from './surface'

test(`${finalizeSurface.name}`, () => {
  const surface = [new p5.Vector(100, 0, 0), new p5.Vector(-100, 0, 0), new p5.Vector(0, 0, -100)]
  const theOther = new p5.Vector(0, -100, -50)
  const spyVertex = jest.spyOn(p, 'vertex')
  jest.spyOn(p, 'normal').mockImplementation()
  finalizeSurface(surface, theOther)
  surface.forEach((v) => {
    expect(spyVertex).toHaveBeenCalledWith(...v.array(), expect.any(Number), expect.any(Number))
  })
})

test.each([
  [
    [
      [100, 0, 0],
      [-100, 0, 0],
      [0, 0, -100],
    ],
    [0, -100, -50],
  ],
  [
    [
      [100, 0, 0],
      [-100, 0, 0],
      [0, 0, -100],
    ],
    [0, 100, -50],
  ],
])(`${calcNormal.name}`, (surface, theOther) => {
  const surfaceVertices = surface.map((s) => new p5.Vector(...s))
  const theOtherVertex = new p5.Vector(...theOther)
  const normal = calcNormal(surfaceVertices, theOtherVertex)
  expect(normal.array()).toMatchSnapshot()
})
