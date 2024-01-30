import p5 from 'p5'

export type Camera = ReturnType<typeof createCamera>

export const createCamera = () => {
  const camera = new p5.Camera()
  let movement = new p5.Vector()
  return {
    get position() {
      return [camera.eyeX, camera.eyeY, camera.eyeZ]
    },
    setMovement: (v: p5.Vector) => {
      movement = v
    },
    get movement() {
      return movement
    },
    move() {
      camera.move(...(movement.array() as [number, number, number]))
    },
    camera
  }
}
