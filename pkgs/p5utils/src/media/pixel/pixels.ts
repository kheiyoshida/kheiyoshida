import { RGBA, RGBAIndexes, RGBAMatrix } from '../../data/matrix/types'
import { leftTopIze } from './position'
import { MediaSize, PixelPosition } from './types'
import { makePixelIndexGetter } from './utils'

export const iteratePixels = (
  mediaSize: MediaSize,
  iterate: (rgbaIndexes: RGBAIndexes, x: number, y: number) => void
) => {
  for (let y = 0; y < mediaSize.height; y++) {
    for (let x = 0; x < mediaSize.width; x++) {
      const rgbaIndexes = makePixelIndexGetter(mediaSize.width)(x,y)
      iterate(rgbaIndexes, x, y)
    }
  }
}

/**
 * Parse media pixels and make RGBA matrix
 *
 * @param pixels pixel array of image/video
 * @param skip number of pixels it should skip during the parse
 * @param magnifiedSize actual size compared to the original media size. i.e. magnified
 * @param position top left position of the magnified frame on the original media
 * @returns
 */
export const convertPixelDataIntoMatrix = (
  pixels: number[] | Uint8ClampedArray,
  mediaSize: MediaSize,
  skip: number,
  magnifiedSize: MediaSize,
  centerPosition: PixelPosition = { x: 0, y: 0 }
) => {
  const leftTopPosition = leftTopIze(centerPosition, magnifiedSize)
  const matrix: RGBAMatrix = []
  for (let y = leftTopPosition.y; y < leftTopPosition.y + magnifiedSize.height; y += skip) {
    const row: RGBA[] = []
    for (let x = leftTopPosition.x; x < leftTopPosition.x + magnifiedSize.width; x += skip) {
      const i = y * mediaSize.width + x
      const pos = i * 4 // 4 items in each pixel
      const r = pixels[pos]
      const g = pixels[pos + 1]
      const b = pixels[pos + 2]
      const a = pixels[pos + 3]
      row.push([r, g, b, a])
    }
    matrix.push(row)
  }
  return matrix
}

export const calcPixelSize = (
  { width, height }: MediaSize,
  skip: number,
  canvasWidth: number,
  canvasHeight: number
) => ({
  pxw: canvasWidth / Math.ceil(width / skip),
  pxh: canvasHeight / Math.ceil(height / skip),
})
