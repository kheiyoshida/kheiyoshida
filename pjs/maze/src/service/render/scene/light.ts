/**
 * get value in range of 0 - 1 with cosine curve
 */
export const calcSmoothValue = (frameNumber: number, animationFramesLength: number): number => {
  const percentage = frameNumber / animationFramesLength
  return (1 + Math.cos(Math.PI + percentage * Math.PI)) / 2
}
