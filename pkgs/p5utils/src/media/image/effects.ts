import p5 from 'p5'
import { loop, randomIntInclusiveBetween } from 'utils'

type ImgEffect = (img: p5.Image) => p5.Image

/**
 * @param threshold value between 0.0 (black) and 1.0 (white)
 */
export const applyBlackAndWhiteFilter =
  (threshold: number): ImgEffect =>
  (img) => {
    img.filter(p.THRESHOLD, threshold)
    return img
  }

export const applyBlurFilter =
  (blurValue = 4): ImgEffect =>
  (img) => {
    img.filter(p.BLUR, blurValue)
    return img
  }

export const applyMonochromeFilter: ImgEffect = (img) => {
  img.filter(p.GRAY)
  return img
}

export const applyRandomSwap =
  (loops = 4, size?: number): ImgEffect =>
  (img) => {
    const getSize = () => size || randomIntInclusiveBetween(0, img.width)
    const randomPos = (): [number, number] => [
      randomIntInclusiveBetween(0, img.width),
      randomIntInclusiveBetween(0, img.height),
    ]
    loop(loops, () => {
      const source = randomPos()
      const dest = randomPos()
      const finalSize = getSize()
      img.copy(...source, finalSize, finalSize, ...dest, finalSize, finalSize)
    })
    return img
  }
