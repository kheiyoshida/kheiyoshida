import p5 from 'p5'
import { createCamera } from '.'

test(``, () => {
  const v = new p5.Vector()
  expect(v.array()).toMatchObject([0,0,0])
})

describe(`${createCamera.name}`, () => {
  it(`can move by reading the movement vector`, () => {
    const camera = createCamera()
    camera.setMovement(new p5.Vector())
  })
})
