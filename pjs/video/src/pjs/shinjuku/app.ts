import { makeVideoSupply } from '../../media/video/supply'
import { loadVideoSourceList, waitForVideosToLoad } from '../../media/video/load'
import { cdnVideoSourceList } from './videos'
import { getGL } from '../../gl/gl'
import { Texture } from '../../gl/texture'
import { DotInstance } from '../../gl/model/dot'
import { OffScreenTextureRenderer } from '../../gl/renderers/offscreen'
import { ScreenRenderer } from '../../gl/renderers/renderer'
import { PixelParser } from '../../media/pixels/parse'
import { clamp, makeIntWobbler } from 'utils'
import { ImageScope } from '../../media/pixels/scope/scope'
import { Analyzer, FFTSize } from '../../media/audio/types'
import { callContext, createAnalyzer, createSoundSource } from '../../media/audio/analyzer'
import { getMusicLoc } from '../../media/cdn'
import { Message } from './message'
import { makeInteraction, updateScope, updateVideo } from './domain'

// config
const isVertical = window.innerWidth < window.innerHeight
const fftSize: FFTSize = 32

const frameBufferWidth = 960
const frameBufferHeight = frameBufferWidth / (16 / 9)
const finalResolutionWidth = frameBufferWidth / 4
const backgroundColor: [number, number, number, number] = [0, 0, 0, 1]
const updateFrequency = 4

export const app = async () => {
  // init gl
  getGL()

  // init canvas resolution
  const canvas = document.getElementById('canvas')! as HTMLCanvasElement
  canvas.style.aspectRatio = `${4 / 3}`
  if (isVertical) {
    canvas.height = canvas.width / (4 / 3)
  } else {
    canvas.style.height = `100vh`
    canvas.style.width = `auto`
    canvas.height = window.innerHeight
    canvas.width = canvas.height * (4 / 3)
  }

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
  const videoElements = loadVideoSourceList(cdnVideoSourceList)
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
  const maxInstanceCount = scope.finalResolution.width * scope.finalResolution.height
  const dotAspectRatio = (2 * 16) / 9
  const dotInstance = new DotInstance(maxInstanceCount, dotAspectRatio)

  // loading & interactions
  let loaded = false
  let started = false

  const message = new Message()
  message.text = 'loading...'

  const interact = makeInteraction(videoSupply, scope)

  message.div.onclick = () => {
    if (!loaded) return
    playSound()
    message.hide()
    started = true

    canvas.addEventListener('pointerdown', (e) => {
      interact(e)
    })
  }

  await waitForVideosToLoad(
    videoElements,
    (progress) => (message.text = `loading: ${progress}%`),
    30,
    'canplaythrough'
  )
  loaded = true
  message.text = 'click/tap to play'

  function renderVideo(frameCount: number) {
    if (!started) return
    playSound()

    if (frameCount % updateFrequency === 0) {
      updateVideo(videoSupply)
      updateScope(scope)
    }

    videoTexture.setTextureImage(videoSupply.currentVideo)
    const rawPixels = offscreenTextureRenderer.renderAsPixels()
    const parsedPixels = parser.parsePixelData(rawPixels)

    const wave = calcWave(analyser)
    const wiggle = makeIntWobbler(clamp(wave * 8, 1, 10))

    let k = 0
    for (let y = 0; y < resolutionHeight; y += 1) {
      for (let x = 0; x < resolutionWidth; x += 1) {
        const i = (y * resolutionWidth + x) * 4
        if (parsedPixels[i + 2] > 70 + wave * 30) {
          dotInstance.instanceDataArray[k++] = wiggle(x) / resolutionWidth
          dotInstance.instanceDataArray[k++] = wiggle(y) / resolutionHeight

          const brightnessLevel = parsedPixels[i + 2] / 255
          dotInstance.instanceDataArray[k++] = brightnessLevel / 2
          dotInstance.instanceDataArray[k++] = brightnessLevel
          dotInstance.instanceDataArray[k++] = brightnessLevel

          const dotSize = clamp((1 + wave) / 10, 0.25, 0.3)
          dotInstance.instanceDataArray[k++] = dotSize * singleDotSize
        }
      }
    }

    const finalInstanceCount = k / 6
    dotInstance.updateInstances(finalInstanceCount)
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
