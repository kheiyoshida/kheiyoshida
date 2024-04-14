import { FrameIntervalMS } from '../../config'

export const FrameCountInterval = [1, 2, 3, 4, 5, 6] as const

const MAX_FRAMECOUNT = (FrameCountInterval as unknown as number[]).reduceRight((p, c) => p * c)

export const makeIntervalHandler = (intervalMS = FrameIntervalMS, maxCount = MAX_FRAMECOUNT) => {
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

export const handleInterval = makeIntervalHandler()
