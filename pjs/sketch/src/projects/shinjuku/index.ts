/* eslint-disable no-extra-semi */
import p5 from 'p5'
import { iterateMatrix } from 'p5utils/src/lib/data/matrix/matrix'
import {
  callContext,
  createAnalyzer,
  createSoundSource,
} from 'p5utils/src/lib/media/audio/analyzer'
import { FFTSize } from 'p5utils/src/lib/media/audio/types'
import { makeParseOptionSelector, parseVideo } from 'p5utils/src/lib/media/video'
import { brightness } from 'p5utils/src/lib/media/video/analyze'
import { calcPixelSize } from 'p5utils/src/lib/media/video/pixels'
import { prepareVideoElements } from 'p5utils/src/lib/media/video/source'
import { makeVideoSupply } from 'p5utils/src/lib/media/video/supply'
import { makeIntWobbler, fireByRate as random, randomItemFromArray } from 'utils'
import sound from '../../assets/music/shinjuku.mp3'
import { videoSource } from './source'

const VIDEO_PARSE_PX_WIDTH = 160

let cw: number
let ch: number

let fillColor: p5.Color
let strokeColor: p5.Color

const fftSize: FFTSize = 32
const soundSource = createSoundSource(
  sound
  // require('../../assets/music/shinjuku.mp3')
  // requireMusic('shinjuku.mp3')
)
const analyser = createAnalyzer(soundSource.source, fftSize)

let started = false
const start = () => {
  const context = callContext()
  if (context.state === 'suspended') {
    context.resume()
  }
  soundSource.play()
  started = true
}

let videoSupply: ReturnType<typeof makeVideoSupply>
let parseOptions: ReturnType<typeof makeParseOptionSelector>

let loaded = false

const setup = () => {
  cw = p.windowWidth
  ch = p.windowHeight
  p.createCanvas(cw, ch)
  fillColor = p.color(20, 200)
  p.background(0)
  p.fill(fillColor)
  strokeColor = p.color(255)
  p.stroke(strokeColor)
  p.strokeWeight(1)
  p.frameRate(4)
  p.angleMode(p.DEGREES)

  const play = () => {
    start()
    prepareVideoElements(videoSource).then((videoElements) => {
      videoSupply = makeVideoSupply(videoElements, { speed: 0.1 })
      videoSupply.onEnded(() => videoSupply.swapVideo())
      parseOptions = makeParseOptionSelector(videoElements[0], VIDEO_PARSE_PX_WIDTH)
      loaded = true
    })
  }

  p.mousePressed = play
  p.touchStarted = play
}

const wobble10 = makeIntWobbler(10)
const wobble2 = makeIntWobbler(2)

const draw = () => {
  if (!started || !loaded) return
  // if (p.frameCount % 4 !== 0) return
  p.rect(-1, -1, cw + 1, ch + 1)

  if (random(0.02)) {
    videoSupply.swapVideo()
  }
  const video = videoSupply.currentVideo

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

  const options = parseOptions.currentOptions
  const videoSnapshot = parseVideo(video, options)
  const { pxh, pxw } = calcPixelSize(options.size, options.skip, cw, ch)

  const drawCell = (x: number, y: number) => {
    p.rect(wobble2(x * pxw), y * pxh, pxw, pxw)
    // p.rect(x * pxw, y * pxh, pxw * 0.4, pxh * 0.4)
    // ;[...Array(4)].map(() => {
    //   p.point(wobble10(x * pxw), wobble10(y * pxh))
    // })
    // p.ellipse(wobble(x * pxw), wobble(y * pxh), pxw * 0.3, pxw * 0.3)
  }

  iterateMatrix(videoSnapshot, (x, y, rgba) => {
    const bri = brightness(rgba)
    if (bri > 100) {
      p.push()
      // p.stroke(255, bri)
      // p.stroke(bri, bri)
      p.noStroke()
      p.fill(bri, bri)
      drawCell(x, y)
      p.pop()
    }
  })
}

export default <Sketch>{
  setup,
  draw,
}
