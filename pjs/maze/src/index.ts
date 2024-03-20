/* eslint-disable no-var */
import Logger from 'js-logger'
import type p5 from 'p5'
import pjson from '../package.json'
import { Conf } from './config'
import { P5Canvas } from './lib/p5canvas'
import { initializeServices } from './service'
import { applyPalette, getPalette } from './service/render/color/palette'
import { renderStartPage } from './service/render/others/start'
import { toneStart } from './service/sound'

Logger.useDefaults()
Logger.setLevel(Logger.WARN)

declare global {
  var p: p5
}

const VERSION = pjson.version

let started = false

const setup = () => {
  p.createCanvas(Conf.ww, Conf.wh, p.WEBGL)
  applyPalette(getPalette())
  p.noLoop()
  p.textSize(32)
  p.angleMode(p.DEGREES)

  const start = () => {
    if (!started) {
      started = true
      initializeServices()
    }
    toneStart()
  }

  renderStartPage(VERSION)

  p.mouseClicked = start
  p.touchStarted = start
}

export default P5Canvas({
  setup,
  draw: () => undefined,
})
