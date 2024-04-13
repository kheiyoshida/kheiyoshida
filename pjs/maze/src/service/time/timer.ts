export const FrameInterval = [1, 2, 3, 4, 5, 6] as const

const MAX_FRAMECOUNT = (FrameInterval as unknown as number[]).reduceRight((p, c) => p * c)

export const makeIntervalTimer = (intervalMS: number, maxCount = MAX_FRAMECOUNT) => {
  let frameCount = 0
  return (event: (frameCount: number) => void) => {
    setInterval(() => {
      frameCount++
      if (frameCount === maxCount) {
        frameCount = 0
      }
      event(frameCount)
    }, intervalMS)
  }
}
