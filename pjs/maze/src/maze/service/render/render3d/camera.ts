const DefaultZ = 800
export const cameraReset = () => {
  p.camera(0, 0, DefaultZ, 0, 0, -DefaultZ)
}

const Size = 1000
export const moveCamera = (zDelta: number, turnDelta?: number) => {
  const finalX = turnDelta ? turnDelta * Size : 0
  const finalZ = DefaultZ + zDelta * -Size
  p.camera(0, 0, finalZ, finalX, 0, -DefaultZ)
}

export const GoMoveMagValues = [0.05, 0.1, 0.24, 0.33, 0.5, 0.65, 0.8, 0.95]

const createSinArray = (length: number, max = 0.5) =>
  [...Array(length)].map((_, i) => Math.sin(max * Math.PI * (i / length)))

export const TurnMoveLRDeltaValues = createSinArray(4, 0.15)
