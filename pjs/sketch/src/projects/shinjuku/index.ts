/* eslint-disable no-extra-semi */
import p5 from 'p5'
import {
  callContext,
  createAnalyzer,
  createSoundSource,
} from 'p5utils/src/lib/media/audio/analyzer'
import { FFTSize } from 'p5utils/src/lib/media/audio/types'
import {
  PixelParseOptionSelector,
  makePixelParseOptionSelector,
} from 'p5utils/src/lib/media/pixel/options'
import { parseVideo } from 'p5utils/src/lib/media/video'
import { prepareVideoElements } from 'p5utils/src/lib/media/video/source'
import { VideoSupply, makeVideoSupply } from 'p5utils/src/lib/media/video/supply'
import sound from '../../assets/music/shinjuku.mp3'

import { calcPixelSize } from 'p5utils/src/lib/media/pixel/pixels'
import { memorize } from 'utils'
import { drawMatrix } from './render'
import { videoSource } from './source'
import { updateVideoOptions } from './update'
import { RGBAMatrix } from 'p5utils/src/lib/data/matrix/types'

const VIDEO_PARSE_PX_WIDTH = 320
const FrameRate = 16

export let cw: number
export let ch: number

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
  fillColor = p.color(0)
  strokeColor = p.color(255)
  p.background(0)
  p.fill(fillColor)
  p.stroke(strokeColor)
  p.strokeWeight(1)
  p.frameRate(FrameRate)
  p.angleMode(p.DEGREES)
  p.noStroke()

  p.mousePressed = start
  p.touchStarted = start
}

let videoSnapshot: RGBAMatrix

const draw = () => {
  if (!started) return
  p.rect(-1, -1, cw + 1, ch + 1)

  updateVideoOptions(videoSupply, parseOptions)
  const options = parseOptions.currentOptions
  const pxSize = calcPxSize(options.size, options.skip, cw, ch)

  if (p.frameCount % 4 === 0 || !videoSnapshot) {
    videoSnapshot = parseVideo(videoSupply.currentVideo, options)
  }

  drawMatrix(videoSnapshot, pxSize, analyser)
}

const calcPxSize = memorize(calcPixelSize)

export default <Sketch>{
  setup,
  draw,
}
