import { makeVideoSupply } from '../../media/video/supply'
import { checkLoadingState, loadVideoSourceList, waitForVideosToLoad } from '../../media/video/load'
import { cdnVideoSourceList } from './videos'
import { getGL } from '../../gl/gl'
import { Texture } from '../../gl/texture'
import { DotInstance } from '../../gl/model/dot'
import { OffScreenTextureRenderer } from '../../gl/renderers/offscreen'
import { ScreenRenderer } from '../../gl/renderers/renderer'
import { PixelParser } from '../../media/pixels/parse'
import { clamp, randomIntInclusiveBetween } from 'utils'
import { ImageScope } from '../../media/pixels/scope/scope'
import { Analyzer, FFTSize } from '../../media/audio/types'
import { createAnalyzer, createSoundSource } from '../../media/audio/analyzer'
import { getMusicLoc } from '../../media/cdn'
import { Message } from './message'

export const app = async () => {
  const videoElements = loadVideoSourceList(cdnVideoSourceList)
  const videoSupply = makeVideoSupply(videoElements, { speed: 0.3 })
  videoSupply.onEnded(() => videoSupply.swapVideo())

  const fftSize: FFTSize = 32
  const soundSource = createSoundSource(getMusicLoc('shinjuku_240131.mp3'))
  const analyser = createAnalyzer(soundSource.source, fftSize)

  getGL()

  const videoTexture = new Texture()
  const frameBufferWidth = 640 // 320
  const frameBufferHeight = frameBufferWidth / (16 / 9)
  const offscreenTextureRenderer = new OffScreenTextureRenderer(
    videoTexture,
    frameBufferWidth,
    frameBufferHeight
  )

  const screenRenderer = new ScreenRenderer()
  screenRenderer.backgroundColor = [0, 0, 0, 1]
  const dotInstance = new DotInstance(3)

  const scope = new ImageScope(
    {
      width: frameBufferWidth,
      height: frameBufferHeight,
    },
    frameBufferWidth / 4
  )
  const parser = new PixelParser(scope)
  const { width: resolutionWidth, height: resolutionHeight } = scope.finalResolution

  const singleDotSize = 0.5 / resolutionHeight

  let started = false

  const message = new Message()
  message.text = 'loading...'

  const canvas = document.getElementById('canvas')!
  canvas.addEventListener('pointerdown', () => {
    soundSource.play()
    message.hide()
    started = true
  })

  const check = setInterval(() => {
    const state = checkLoadingState(videoElements)
    message.text = `loading: ${Math.floor(state * 100)}%`
  }, 100)
  await waitForVideosToLoad(videoElements)
  clearInterval(check)

  message.text = 'click/tap to play'

  function renderVideo() {
    requestAnimationFrame(renderVideo)
    if (!started) return

    if (Math.random() < 0.03) {
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
        if (parsedPixels[i + 2] > 120) {
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

  renderVideo()
}
