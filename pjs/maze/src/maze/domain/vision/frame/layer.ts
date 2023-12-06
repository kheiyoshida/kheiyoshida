import { Frame } from '.'

export type Layer = {
  outer: Frame
  middle: Frame
  inner: Frame
}

/**
 * we have 6 layers in total
 */
export const LAST_LAYER_INDEX = 6

/**
 * extract layer (frames) to draw objects
 */
export const extractLayer = (frames: Frame[], layerIdx: number): Layer => {
  if (layerIdx >= LAST_LAYER_INDEX)
    throw Error(`layer position should be less than ${LAST_LAYER_INDEX}`)
  const reversed = 5 - layerIdx
  const r = {
    outer: frames[reversed],
    middle: frames[reversed + 1],
    inner: frames[reversed + 2],
  }
  if (r.outer && r.middle && r.inner) return r
  throw Error(`invalid index`)
}
