import { getGL } from '../../gl/gl'
import { ScreenPass } from '../../gl/pass/pass'
import { clamp } from 'utils'
import { Analyzer, FFTSize } from '../../media/audio/types'
import { callContext, createAnalyzer, createSoundSource } from '../../media/audio/analyzer'
import { getMusicLoc } from '../../media/cdn'
import { Message } from './message'
import { ShinjukuChannel } from './channel'
import { DotPresentation } from './presentation'

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

  // rendering
  const screenPass = new ScreenPass()
  screenPass.backgroundColor = backgroundColor

  const dotAspectRatio = (2 * 16) / 9
  const dotPresentation = new DotPresentation(channel.outputResolution, dotAspectRatio)

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

    // param phase
    playSound()

    if (frameCount % updateFrequency === 0) {
      channel.update()
    }

    dotPresentation.wave = calcWave(analyser)

    // instance presentation phase
    const parsedPixels = channel.getPixels()
    dotPresentation.represent(parsedPixels)

    screenPass.render([dotPresentation.instance])
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
