/* eslint-disable no-extra-semi */
import p5 from 'p5'
import { callContext, createAnalyzer, createSoundSource } from 'p5utils/src/media/audio/analyzer'
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
import { instruction } from 'p5utils/src/utils/project'

const LIGHT_THRESHOLD_DEVICE_WIDTH = 800
const isLight = window.innerWidth < LIGHT_THRESHOLD_DEVICE_WIDTH

export const VIDEO_PARSE_PX_WIDTH = isLight ? 64 : 200
const FrameRate = isLight ? 32 : 16
let pxSize: ReturnType<typeof calcPixelSize>

export let cw: number
export let ch: number

let fillColor: p5.Color
let strokeColor: p5.Color

const fftSize: FFTSize = 32
const soundSource = createSoundSource(requireMusic('shinjuku_240131.mp3'))
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
  const div = instruction('loading...')
  prepareVideoElements(videoSource).then((videoElements) => {
    videoSupply = makeVideoSupply(videoElements, { speed: 0.1 })
    videoSupply.onEnded(() => videoSupply.swapVideo())
    parseOptions = makePixelParseOptionSelector(videoElements[0], VIDEO_PARSE_PX_WIDTH)
    pxSize = calcPxSize(parseOptions.currentOptions.size, parseOptions.currentOptions.skip, cw, ch)
    videoLoaded = true
    div.remove()
    instruction('click/tap to play')
  })
}

const start = () => {
  if (!videoLoaded) return
  if (!videoSupply.currentVideo) {
    videoSupply.swapVideo()
  }
  playSound()
  started = true
  p.removeElements()
}

const setup = () => {
  prepareVideo()
  if (isLight) {
    cw = p.windowWidth
    ch = (cw * 3) / 4
  } else {
    ch = p.windowHeight
    cw = (ch * 4) / 3
  }
  const canvas = document.getElementsByTagName('canvas')[0]
  const marginTop = (p.windowHeight - ch) / 2
  const marginLeft = (p.windowWidth - cw) / 2
  canvas.setAttribute('style', `margin-left: ${marginLeft}px; margin-top: ${marginTop}px;`)
  p.createCanvas(cw, ch)
  fillColor = p.color(0, 200)
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

const VideoUpdateFrames = isLight ? 8 : 4

const draw = () => {
  if (!started) return
  p.rect(-1, -1, cw + 1, ch + 1)
  playSound()

  if (p.frameCount % VideoUpdateFrames === 0 || !brightnessSnapshot) {
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
