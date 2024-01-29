import p5 from 'p5'
import { createCamera } from '.'

describe(`${createCamera.name}`, () => {
  it(`can move by reading the movement vector`, () => {
    const camera = createCamera()
    camera.setMovement(new p5.Vector())
  })
})
