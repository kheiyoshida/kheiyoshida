import { transColor } from 'src/lib/p5utils/color'
import {
  changePaletteColor,
  getPalette,
  setPalette,
} from 'src/maze/domain/vision/color/palette'
import { translateFrame } from 'src/maze/domain/vision/frame/altFrame'
import { DEFAULT_MAGNIFY_RATES } from 'src/maze/domain/vision/frame/magnify'
import { Conf } from '../../config'
import {
  genRender,
  inject,
  intervalRender,
  reserveIntervalRender,
} from './base'
import { corridorToNextFloor } from './others/scenes'
import * as RenderQueue from './queue'

/**
 * render current view
 */
export const renderCurrentView = inject((renderSpecs, vision) => {
  RenderQueue.push(() => genRender(renderSpecs, vision)(vision.frames(1)))
  RenderQueue.consume()
})

const goMoveMagnifySeq = [1.05, 1.1, 1.24, 1.33, 1.5, 1.65, 1.8, 1.95]

/**
 * render going forward movement
 */
export const renderGo = inject((renderSpecs, vision, speed) => {
  intervalRender(
    speed * Conf.frameInterval,
    genRender(renderSpecs, vision),
    goMoveMagnifySeq.map(vision.frames)
  )
})

/**
 * [magnify, transLR]
 */
const TURN_ADJUST_VALUES = [
  [0.85, 0.01],
  [0.9, 0.03],
  [0.95, 0.08],
  [1, 0.11],
] as const

export const renderTurn = (d: 'r' | 'l') =>
  inject((renderSpecs, vision, speed) => {
    const slide = (trans: number): [number, number] => [
      (d === 'r' ? -1 : 1) * trans * Conf.ww,
      0,
    ]
    intervalRender(
      speed * Conf.frameInterval,
      genRender(renderSpecs, vision),
      TURN_ADJUST_VALUES.map(([mag, trans]) =>
        vision.frames(mag).map((f) => translateFrame(slide(trans))(f))
      )
    )
  })

const secondMag = DEFAULT_MAGNIFY_RATES[1]
const magnifyDownStairs = Array(12)
  .fill(null)
  .map((_, i) => secondMag / i)
  .reverse()

export const renderGoDownstairs = inject((renderSpecs, vision, speed) => {
  const wh = Conf.wh
  const ren = genRender(renderSpecs, vision)
  const originalStroke = getPalette().stroke
  reserveIntervalRender(
    speed * Conf.frameInterval * 3,
    (f, i) => {
      setPalette(
        changePaletteColor('stroke', transColor(originalStroke, -i * 25))
      )
      ren(f)
      if (i >= magnifyDownStairs.length - 1) {
        setPalette(changePaletteColor('stroke', originalStroke))
      }
    },
    magnifyDownStairs.map((hd, i) => {
      const fixed = wh * 0.1
      const r: number = 1 + i * ((1 / secondMag - 1) / magnifyDownStairs.length)
      return vision
        .frames(r * 1.05)
        .map((f) =>
          translateFrame([
            0,
            i % 2 === 0
              ? -wh * hd * r * 1.2 - fixed * 2
              : -wh * hd * r * 1.2 - fixed * 1.8,
          ])(f)
        )
    })
  )
})

export const renderProceedToNextFloor = inject((_, vision, speed) => {
  reserveIntervalRender(
    speed * Conf.frameInterval * 2,
    genRender(corridorToNextFloor, vision),
    goMoveMagnifySeq.slice(6).map(vision.frames)
  )
})
