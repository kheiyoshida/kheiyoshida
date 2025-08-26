import { makeVideoSupply } from '../../media/video/supply'
import { checkLoadingState, loadVideoSourceList, waitForVideosToLoad } from '../../media/video/load'
import { videoSourceList } from './videos'
import { getGL } from '../../gl/gl'
import { Texture } from '../../gl/texture'
import { DotInstance } from '../../gl/model/dot'
import { OffScreenTextureRenderer } from '../../gl/renderers/offscreen'
import { ScreenRenderer } from '../../gl/renderers/renderer'
import { PixelParser } from '../../media/pixels/parse'
import { clamp, fireByRate, randomIntInclusiveBetween } from 'utils'
import { ImageScope } from '../../media/pixels/scope/scope'
import { Analyzer, FFTSize } from '../../media/audio/types'
import { callContext, createAnalyzer, createSoundSource } from '../../media/audio/analyzer'
import { getMusicLoc } from '../../media/cdn'
import { Message } from './message'

// config
const fftSize: FFTSize = 32

const frameBufferWidth = 640
const frameBufferHeight = frameBufferWidth / (16 / 9)
const finalResolutionWidth = frameBufferWidth / 4
const backgroundColor: [number, number, number, number] = [0, 0, 0, 1]

export const app = async () => {
  // init gl
  getGL()

  // sound
  const soundSource = createSoundSource(getMusicLoc('shinjuku_240131.mp3'))
  const analyser = createAnalyzer(soundSource.source, fftSize)
  const playSound = () => {
    const context = callContext()
    if (context.state === 'suspended') {
      context.resume()
    }
    soundSource.play()
  }

  // video
  const videoElements = loadVideoSourceList(videoSourceList)
  const videoSupply = makeVideoSupply(videoElements, { speed: 0.3 })
  videoSupply.onEnded(() => videoSupply.swapVideo())

  // texture
  const videoTexture = new Texture()
  const offscreenTextureRenderer = new OffScreenTextureRenderer(
    videoTexture,
    frameBufferWidth,
    frameBufferHeight
  )

  // parser
  const scope = new ImageScope(
    {
      width: frameBufferWidth,
      height: frameBufferHeight,
    },
    finalResolutionWidth
  )
  const parser = new PixelParser(scope)
  const { width: resolutionWidth, height: resolutionHeight } = scope.finalResolution
  const singleDotSize = 0.5 / resolutionHeight

  // rendering
  const screenRenderer = new ScreenRenderer()
  screenRenderer.backgroundColor = backgroundColor
  const dotInstance = new DotInstance(3)

  // loading & interactions
  let started = false

  const message = new Message()
  message.text = 'loading...'

  const canvas = document.getElementById('canvas')!
  canvas.addEventListener('pointerdown', () => {
    playSound()
    message.hide()
    started = true
  })

  await waitForVideosToLoad(videoElements, (progress) => message.text = `loading: ${progress}%`)
  message.text = 'click/tap to play'

  function renderVideo(frameCount: number) {
    if (!started) return
    playSound()

    if (fireByRate(0.03)) {
      videoSupply.swapVideo()
      scope.magnifyLevel = randomIntInclusiveBetween(0, scope.maxMagnifyLevel)
      scope.position = {
        x: scope.position.x + randomIntInclusiveBetween(-100, 100),
        y: scope.position.y + randomIntInclusiveBetween(-100, 100),
      }
    }

    videoTexture.setTextureImage(videoSupply.currentVideo)
    const rawPixels = offscreenTextureRenderer.renderAsPixels()
    const parsedPixels = parser.parsePixelData(rawPixels)

    const wave = calcWave(analyser)
    const wiggle = () => randomIntInclusiveBetween(Math.floor(-wave * 2), Math.floor(wave * 2))

    const instanceData = []
    for (let y = 0; y < resolutionHeight; y += 1) {
      for (let x = 0; x < resolutionWidth; x += 1) {
        const i = (y * resolutionWidth + x) * 4
        if (parsedPixels[i + 2] > 80) {
          instanceData.push((x + wiggle()) / resolutionWidth, (y + wiggle()) / resolutionHeight)

          // instanceData.push(parsedPixels[i] / 255, parsedPixels[i + 1] / 255, parsedPixels[i + 2] / 255)
          const bri = parsedPixels[i + 2] / 255
          instanceData.push(bri, bri, bri)

          instanceData.push((0.2 + wave * 0.1) * singleDotSize)
        }
      }
    }

    dotInstance.setInstances(instanceData)
    dotInstance.setSize(0.1 / resolutionHeight)
    screenRenderer.render([dotInstance])
  }

  const calcWave = (analyzer: Analyzer) => {
    const base = analyzer.analyze().reduce((a, b) => a + b) / analyzer.bufferLength
    return clamp((base - 0.3) * 10, 0, 2)
  }

  const targetFps = 30
  const minFrameTime = 1000 / targetFps // ms
  let lastFrame = performance.now()
  let frameCount = 0
  function loop(now: number) {
    const elapsed = now - lastFrame
    if (elapsed >= minFrameTime) {
      lastFrame = now - (elapsed % minFrameTime) // reduce drift
      frameCount += 1
      renderVideo(frameCount)
    }
    requestAnimationFrame(loop)
  }
  requestAnimationFrame(loop)
}
