import { RGBA } from 'p5utils/src/data/matrix'
import { iteratePixels } from 'p5utils/src/media/pixel/pixels'
import { createUpdateBuffer } from 'p5utils/src/media/pixel/updateBuffer'
import {
  bulkUpdatePixelValues,
  getPixelValues,
  makePixelPositionShift,
} from 'p5utils/src/media/pixel/utils'
import { clamp, fireByRate, randomIntInAsymmetricRange, randomIntInclusiveBetween } from 'utils'
import {
  CanvasMediaSize,
  DefaultGrayValue,
  NoiseLevel,
  NoiseSwitchRate,
  ShiftChangeRate,
  ShiftRange,
} from './config'

export function blur() {
  const buffer = createUpdateBuffer(CanvasMediaSize)
  const makeShift = makePixelPositionShift(CanvasMediaSize)
  const getShiftValue = () => randomIntInAsymmetricRange(ShiftRange)
  let [shiftX, shiftY] = [getShiftValue(), getShiftValue()]

  iteratePixels(CanvasMediaSize, ([ri, gi, bi, ai], x, y) => {
    if (fireByRate(ShiftChangeRate)) {
      shiftX = getShiftValue()
      shiftY = getShiftValue()
    }
    const shift = makeShift((x, y) => [x + shiftX, y + shiftY])
    const shifted = shift(x, y)
    if (!shifted) return
    const [sx, sy] = shifted

    if (p.pixels[ri] > DefaultGrayValue) {
      const original = getPixelValues(p.pixels, [ri, gi, bi, ai])
      const update = original.map((v) =>
        clamp(v + randomIntInAsymmetricRange(100), 180, 230)
      ) as RGBA
      update[3] = update[0] + randomIntInAsymmetricRange(100)

      if (update[0] > 220) {
        buffer.update(sx, sy, original)
      }

      // const erase: RGBA = mapGrayValue(DefaultGrayValue)
      // bulkUpdatePixelValues(p.pixels, [ri, gi, bi, ai], erase)
    }
  })
  iteratePixels(CanvasMediaSize, (rgbaIndexes, x, y) => {
    const value = buffer.get(x, y)
    if (value) {
      bulkUpdatePixelValues(p.pixels, rgbaIndexes, value)
    }
  })
}

export function addNoise() {
  let on = true
  const randomize = (value: number) => {
    return clamp(value - 60 + randomIntInclusiveBetween(0, NoiseLevel), 0, 255)
  }
  iteratePixels(CanvasMediaSize, (rgbaIndexes) => {
    on = fireByRate(NoiseSwitchRate) ? on : !on
    if (on) return
    const v = randomize(p.pixels[rgbaIndexes[0]])
    bulkUpdatePixelValues(p.pixels, rgbaIndexes, mapGrayValue(v))
  })
}

const mapGrayValue = (v: number) => [v, v, v, 255] as RGBA
