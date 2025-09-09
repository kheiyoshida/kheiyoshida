import { getGL } from '../../gl/gl'
import { DotInstance } from '../../gl/model/dot'
import { ScreenRenderer } from '../../gl/renderers/renderer'
import { clamp, makeIntWobbler } from 'utils'
import { Analyzer, FFTSize } from '../../media/audio/types'
import { callContext, createAnalyzer, createSoundSource } from '../../media/audio/analyzer'
import { getMusicLoc } from '../../media/cdn'
import { Message } from './message'
import { ShinjukuChannel } from './channel'

// config
const isVertical = window.innerWidth < window.innerHeight
const fftSize: FFTSize = 32

const videoAspectRatio = 16 / 9
const frameBufferWidth = 960
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
  const channel = new ShinjukuChannel(videoAspectRatio, frameBufferWidth, frameBufferWidth / 4)

  // dot
  const { width: resolutionWidth, height: resolutionHeight } = channel.outputResolution
  const singleDotSize = 0.5 / resolutionHeight

  // rendering
  const screenRenderer = new ScreenRenderer()
  screenRenderer.backgroundColor = backgroundColor
  const maxInstanceCount = channel.outputResolution.width * channel.outputResolution.height
  const dotAspectRatio = (2 * 16) / 9
  const dotInstance = new DotInstance(maxInstanceCount, dotAspectRatio)

  // loading & interactions
  // message
  const message = new Message()
  message.text = 'loading...'

  let loaded = false
  let started = false

  message.div.onclick = () => {
    if (!loaded) return
    playSound()
    message.hide()
    started = true

    canvas.addEventListener('pointerdown', (e) => channel.interact(e))
  }

  await channel.waitForReady((progress) => (message.text = `loading: ${progress}%`))

  loaded = true
  message.text = 'click/tap to play'

  function renderVideo(frameCount: number) {
    if (!started) return
    playSound()

    if (frameCount % updateFrequency === 0) {
      channel.update()
    }

    const parsedPixels = channel.getPixels()

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
