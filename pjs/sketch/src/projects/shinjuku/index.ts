/* eslint-disable no-extra-semi */
import p5 from 'p5'
import { iterateMatrix } from 'p5utils/src/lib/data/matrix/matrix'
import {
  callContext,
  createAnalyzer,
  createSoundSource,
} from 'p5utils/src/lib/media/audio/analyzer'
import { FFTSize } from 'p5utils/src/lib/media/audio/types'
import { brightness } from 'p5utils/src/lib/media/pixel/analyze'
import {
  PixelParseOptionSelector,
  makePixelParseOptionSelector,
} from 'p5utils/src/lib/media/pixel/options'
import { calcPixelSize } from 'p5utils/src/lib/media/pixel/pixels'
import { parseVideo } from 'p5utils/src/lib/media/video'
import { prepareVideoElements } from 'p5utils/src/lib/media/video/source'
import { VideoSupply, makeVideoSupply } from 'p5utils/src/lib/media/video/supply'
import { pushPop } from 'p5utils/src/lib/utils/p5utils'
import { makeIntWobbler, memorize, fireByRate as random, randomItemFromArray } from 'utils'
import sound from '../../assets/music/shinjuku.mp3'
import { videoSource } from './source'

const VIDEO_PARSE_PX_WIDTH = 320

let cw: number
let ch: number

let fillColor: p5.Color
let strokeColor: p5.Color

const fftSize: FFTSize = 32
const soundSource = createSoundSource(sound)
const analyser = createAnalyzer(soundSource.source, fftSize)

let videoSupply: VideoSupply
let parseOptions: PixelParseOptionSelector
let started = false

const playSound = () => {
  const context = callContext()
  if (context.state === 'suspended') {
    context.resume()
  }
  soundSource.play()
}

let videoLoaded = false
const prepareVideo = () => {
  prepareVideoElements(videoSource).then((videoElements) => {
    videoSupply = makeVideoSupply(videoElements, { speed: 0.1 })
    videoSupply.onEnded(() => videoSupply.swapVideo())
    parseOptions = makePixelParseOptionSelector(videoElements[0], VIDEO_PARSE_PX_WIDTH)
    videoLoaded = true
  })
}

const start = () => {
  if (!videoLoaded) return
  videoSupply.swapVideo()
  playSound()
  started = true
}

const setup = () => {
  prepareVideo()
  cw = p.windowWidth
  ch = p.windowHeight
  p.createCanvas(cw, ch)
  fillColor = p.color(20, 200)
  strokeColor = p.color(255)
  p.background(0)
  p.fill(fillColor)
  p.stroke(strokeColor)
  p.strokeWeight(1)
  p.frameRate(4)
  p.angleMode(p.DEGREES)
  p.noStroke()

  p.mousePressed = start
  p.touchStarted = start
}

const wobble10 = makeIntWobbler(10)
const wobble2 = makeIntWobbler(2)
const calcPxSize = memorize(calcPixelSize)

const draw = () => {
  if (!started) return
  p.rect(-1, -1, cw + 1, ch + 1)

  if (p.frameCount % 2 !== 0) return
  updateVideoOptions()
  drawPixels()
}

const updateVideoOptions = () => {
  // change video options
  if (random(0.2)) {
    videoSupply.swapVideo()
  }
  if (random(0.2)) {
    const superWobble = makeIntWobbler(Math.min(ch, cw) / 4)
    parseOptions.changePosition((position) => ({
      x: superWobble(position.x),
      y: superWobble(position.y),
    }))
    parseOptions.randomMagnify()
    videoSupply.updateOptions({
      speed: randomItemFromArray([0.1, 0.3, 0.5]),
    })
  }
  parseOptions.changePosition((position) => ({
    x: wobble10(position.x),
    y: wobble10(position.y),
  }))
}

const drawPixels = () => {
  const video = videoSupply.currentVideo
  const options = parseOptions.currentOptions
  const videoSnapshot = parseVideo(video, options)
  const { pxh, pxw } = calcPxSize(options.size, options.skip, cw, ch)

  const drawCell = (x: number, y: number) => {
    // p.rect(wobble2(x * pxw), y * pxh, pxw, pxw)
    p.rect(x * pxw, y * pxh, pxw * 0.4, pxh * 0.4)
    // p.ellipse(wobble2(x * pxw), wobble2(y * pxh), pxw * 0.8, pxw * 0.8)
  }

  iterateMatrix(videoSnapshot, (x, y, rgba) => {
    const bri = brightness(rgba)
    if (bri > 150) {
      pushPop(() => {
        p.fill(bri, bri)
        drawCell(x, y)
      })
    }
  })
}

export default <Sketch>{
  setup,
  draw,
}
