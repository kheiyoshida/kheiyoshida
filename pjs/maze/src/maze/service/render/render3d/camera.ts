const DefaultZ = 800
export const cameraReset = () => {
  p.camera(0, 0, DefaultZ, 0, 0, -DefaultZ)
}

const Size = 1000
export const moveCamera = (zDelta: number, turnDelta?: number, upDown?: number) => {
  const finalX = turnDelta ? turnDelta * Size : 0
  const finalZ = DefaultZ + zDelta * -Size
  const finalY = upDown ? upDown * Size : 0
  p.camera(0, finalY, finalZ, finalX, finalY, -DefaultZ)
}

export const GoMoveMagValues = [0.05, 0.1, 0.24, 0.33, 0.5, 0.65, 0.8, 0.95]

const createSinArray = (length: number, max = 0.5) =>
  [...Array(length)].map((_, i) => Math.sin(max * Math.PI * (i / length)))

export const TurnMoveLRDeltaValues = createSinArray(4, 0.15)

const DownFramesLength = 12
export const DownstairsValues: Parameters<typeof moveCamera>[] = [...Array(DownFramesLength)].map(
  (_, i) => {
    const forward = 1.5
    const zDelta = forward * (i / DownFramesLength)
    const constant = 0.1
    const upDown = (i % 2 === 0 ? 0.5 : 0.3) * i
    return [zDelta, 0, constant + upDown]
  }
)
