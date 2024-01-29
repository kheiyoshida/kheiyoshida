/* eslint-disable no-extra-semi */
import p5 from 'p5'
import {
  callContext,
  createAnalyzer,
  createSoundSource,
} from 'p5utils/src/media/audio/analyzer'
import { FFTSize } from 'p5utils/src/media/audio/types'
import {
  PixelParseOptionSelector,
  makePixelParseOptionSelector,
} from 'p5utils/src/media/pixel/options'
import { parseVideo } from 'p5utils/src/media/video'
import { prepareVideoElements } from 'p5utils/src/media/video/source'
import { VideoSupply, makeVideoSupply } from 'p5utils/src/media/video/supply'
import { calcPixelSize } from 'p5utils/src/media/pixel/pixels'
import { memorize } from 'utils'
import { calcWave, drawMatrix } from './render'
import { videoSource } from './source'
import { updateVideoOptions } from './update'
import { iterateMatrix } from 'p5utils/src/data/matrix/matrix'
import { brightness } from 'p5utils/src/media/pixel/analyze'
import { requireMusic } from '../../assets'

export const VIDEO_PARSE_PX_WIDTH = 200
const FrameRate = 16
let pxSize: ReturnType<typeof calcPixelSize>

export let cw: number
export let ch: number

let fillColor: p5.Color
let strokeColor: p5.Color

const fftSize: FFTSize = 32
const soundSource = createSoundSource(requireMusic('shinjuku_remaster.mp3'))
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
    pxSize = calcPxSize(parseOptions.currentOptions.size, parseOptions.currentOptions.skip, cw, ch)
    videoLoaded = true
  })
}

const start = () => {
  if (!videoLoaded) return
  if (!videoSupply.currentVideo) {
    videoSupply.swapVideo()
  }
  playSound()
  started = true
}

const setup = () => {
  prepareVideo()
  cw = p.windowWidth
  ch = cw * 9/ 16
  const marginTop = (p.windowHeight - ch) / 2
  const canvas = document.getElementsByTagName('canvas')[0]
  canvas.setAttribute('style', `margin-top: ${marginTop}px;`)
  p.createCanvas(cw, ch)
  fillColor = p.color(0, 245)
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

export type LocBrightness = [x: number, y: number, brightness: number]
let brightnessSnapshot: LocBrightness[]

const draw = () => {
  if (!started) return
  p.rect(-1, -1, cw + 1, ch + 1)
  playSound()

  if (p.frameCount % 4 === 0 || !brightnessSnapshot) {
    updateVideoOptions(videoSupply, parseOptions)
    const videoSnapshot = parseVideo(videoSupply.currentVideo, parseOptions.currentOptions)
    const bright: LocBrightness[] = []
    iterateMatrix(videoSnapshot, (x, y, rgba) => {
      bright.push([x, y, brightness(rgba)])
    })
    brightnessSnapshot = bright
  }

  drawMatrix(brightnessSnapshot, pxSize, calcWave(analyser))
}

const calcPxSize = memorize(calcPixelSize)

export default <Sketch>{
  setup,
  draw,
}
