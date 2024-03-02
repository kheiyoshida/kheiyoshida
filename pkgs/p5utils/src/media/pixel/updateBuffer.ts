import { RGBA } from '../../data/matrix'
import { MediaSize } from './types'

type PixelUpdateBufferArray = (RGBA | undefined)[][]
export const createUpdateBufferArray = (mediaSize: MediaSize): PixelUpdateBufferArray => {
  return [...Array(mediaSize.height)].map(() => new Array(mediaSize.width).fill(undefined))
}

export const createUpdateBuffer = (mediaSize: MediaSize) => {
  const data = createUpdateBufferArray(mediaSize)
  return {
    get: (x: number, y: number) => data[y][x],
    update: (x: number, y: number, value: RGBA) => {
      data[y][x] = value
    },
  }
}
