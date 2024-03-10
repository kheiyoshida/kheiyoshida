
const DefaultZ = 800
export const cameraReset = () => {
  p.camera(0, 0, DefaultZ, 0, 0, -DefaultZ)
}

const Size = 1000
export const moveCamera = (zDelta: number, turnDelta?: number) => {
  const finalZ = DefaultZ + zDelta * -Size
  p.camera(0, 0, finalZ, 0, 0, -DefaultZ)
}

export const GoMoveMagValues = [0.05, 0.1, 0.24, 0.33, 0.5, 0.65, 0.8, 0.95]
