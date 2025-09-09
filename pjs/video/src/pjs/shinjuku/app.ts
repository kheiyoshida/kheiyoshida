import { getGL } from '../../gl/gl'
import { clamp } from 'utils'
import { FFTSize } from '../../media/audio/types'
import { callContext, createAnalyzer, createSoundSource } from '../../media/audio/analyzer'
import { getMusicLoc } from '../../media/cdn'
import { Message } from './message'
import { ShinjukuChannel } from './channel'
import { DotPresentation } from './presentation'
import { startRenderingLoop, VideoProjectionPipeline } from '../../lib/pipeline'

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

  // rendering
  const channel = new ShinjukuChannel(videoAspectRatio, frameBufferWidth, frameBufferWidth / 4)
  const dotAspectRatio = (2 * 16) / 9
  const dotPresentation = new DotPresentation(channel.outputResolution, dotAspectRatio)

  const pipeline = new VideoProjectionPipeline([channel], [dotPresentation])
  pipeline.setBackgroundColor(backgroundColor)

  function renderLoop(frameCount: number) {
    // control
    playSound()

    // param phase
    if (frameCount % updateFrequency === 0) {
      channel.update()
    }
    const base = analyser.analyze().reduce((a, b) => a + b) / analyser.bufferLength
    dotPresentation.wave = clamp((base - 0.3) * 10, 0, 2)

    // rendering phase
    pipeline.render()
  }

  // set up
  const message = new Message()

  message.text = 'loading...'
  await channel.waitForReady((progress) => (message.text = `loading: ${progress}%`))

  message.text = 'click/tap to play'
  message.div.onclick = () => {
    playSound()
    message.hide()
    startRenderingLoop(renderLoop)
    canvas.addEventListener('pointerdown', (e) => channel.interact(e))
  }
}
