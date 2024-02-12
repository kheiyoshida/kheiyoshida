import p5 from 'p5'
import { randomIntInclusiveBetween } from 'utils'

/**
 * @param threshold value between 0.0 (black) and 1.0 (white)
 */
export const applyBlackAndWhiteFilter = (img: p5.Image, threshold: number) => {
  img.filter(p.THRESHOLD, threshold)
}

export const applyBlurFilter = (img: p5.Image, blurValue = 4) => {
  img.filter(p.BLUR, blurValue)
}

export const applyMonochromeFilter = (img: p5.Image) => {
  img.filter(p.GRAY)
}

export const randomSwap = (img: p5.Image, size?: number) => {
  if (!size) {
    size = randomIntInclusiveBetween(0, img.width)
  }
  const randomPos = (): [number, number] => [
    randomIntInclusiveBetween(0, img.width),
    randomIntInclusiveBetween(0, img.height),
  ]
  const source = randomPos()
  const dest = randomPos()
  img.copy(...source, size, size, ...dest, size, size)
}
