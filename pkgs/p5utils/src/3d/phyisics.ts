export const makeSpeedConsumer =
  (minimumSpeed: number, calcDelta: (speed: number) => number = (s) => (s * 7) / 8) =>
  (currentSpeed: number): number => {
    const newSpeed = calcDelta(currentSpeed)
    if (newSpeed < minimumSpeed) return minimumSpeed
    return newSpeed
  }
