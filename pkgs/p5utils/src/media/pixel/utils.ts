import { RGBA, RGBAIndexes, RGBAMatrix } from '../../data/matrix'
import { iteratePixels } from './pixels'
import { MediaSize, PixelPosition, PixelPositionArray } from './types'

export const makePixelIndexGetter =
  (mediaWidth: number) =>
  (...[x, y]: PixelPositionArray): RGBAIndexes => {
    const i = y * mediaWidth + x
    const pos = i * 4
    return [pos, pos + 1, pos + 2, pos + 3]
  }

export const makePixelPositionShift =
  (size: MediaSize) =>
  (shift: (x: number, y: number) => PixelPositionArray) =>
  (x: number, y: number): PixelPositionArray | undefined => {
    const [rx, ry] = shift(x, y)
    if (rx >= size.width || rx < 0 || ry >= size.height || ry < 0) {
      return undefined
    }
    return [rx, ry]
  }

export const getPixelValues = (pixels: Uint8Array | number[], rgbaIndexes: RGBAIndexes): RGBA => {
  return rgbaIndexes.map((i) => pixels[i]) as RGBA
}
