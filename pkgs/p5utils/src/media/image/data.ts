import p5 from 'p5'
import { randomIntInclusiveBetween } from 'utils'
import { RGBA } from '../../data/matrix/types'
import { iteratePixels } from '../pixel/pixels'

export const loadImage = (imgLoc: string) => {
  const img = p.loadImage(imgLoc)
  img.loadPixels()
  return img
}

export const updateImagePixels = (
  img: p5.Image,
  updater: (originalRGBA: RGBA, x: number, y: number) => RGBA
) => {
  iteratePixels(img, (rgbaIndexes, x, y) => {
    const [ri, gi, bi, ai] = rgbaIndexes
    const originalRGBA: RGBA = [img.pixels[ri], img.pixels[gi], img.pixels[bi], img.pixels[ai]]
    const [r, g, b, a] = updater(originalRGBA, x, y)
    img.pixels[ri] = r
    img.pixels[gi] = g
    img.pixels[bi] = b
    img.pixels[ai] = a
  })
}

export const randomizeImagePixels = (img: p5.Image, randomizeDelta: number) => {
  const rand = (v: number) => v + randomIntInclusiveBetween(-randomizeDelta, randomizeDelta)
  updateImagePixels(img, ([r, g, b, a]) => {
    return [rand(r), rand(g), rand(b), rand(a)]
  })
}
