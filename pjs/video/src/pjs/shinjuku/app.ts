import { clamp } from 'utils'
import { FFTSize } from '../../media/audio/types'
import { createSoundSource, getAudioCtx, SoundAnalyser } from '../../media/audio/analyzer'
import { getMusicLoc } from '../../media/cdn'
import { Message } from './message'
import { ShinjukuChannelNode } from './channel'
import { DotPresentation } from './presentation'
import { startRenderingLoop } from '../../lib/pipeline'
import { DrawRTHandle, FrameBuffer, getGL, InputColorRenderingNode } from 'graph-gl'
import { VideoChannel } from '../../lib-node/channel/channel'
import { PixelDataRTHandle } from '../../lib-node/channel/target'
import { videoSourceList } from './videos'
import { PresentationNode } from '../../lib-node/presentation/node'

// config
const isVertical = window.innerWidth < window.innerHeight
const fftSize: FFTSize = 32

const videoAspectRatio = 16 / 9
const frameBufferWidth = 960
const frameBufferHeight = frameBufferWidth / videoAspectRatio
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
  const analyser = new SoundAnalyser(soundSource, fftSize)
  const playSound = () => {
    const context = getAudioCtx()
    if (context.state === 'suspended') {
      context.resume()
    }
    soundSource.mediaElement.play()
  }

  // channel
  const channel = new VideoChannel(videoSourceList)
  const chNode = new ShinjukuChannelNode(channel)
  chNode.renderTarget = new PixelDataRTHandle(
    new FrameBuffer(frameBufferWidth, frameBufferHeight),
    frameBufferWidth / 4
  )

  // presentation
  const dotAspectRatio = (2 * 16) / 9
  const dotPresentation = new DotPresentation(chNode.outputResolution, dotAspectRatio)
  const presentationNode = new PresentationNode([dotPresentation])
  presentationNode.setPixelDataInput(chNode)
  presentationNode.renderTarget = new DrawRTHandle(new FrameBuffer(frameBufferWidth, frameBufferHeight))
  presentationNode.backgroundColor = backgroundColor

  // screen
  const screenNode = new InputColorRenderingNode()
  screenNode.setInput(presentationNode)
  screenNode.backgroundColor = backgroundColor

  chNode.validate()
  presentationNode.validate()
  screenNode.validate()

  function renderLoop(frameCount: number) {
    // control
    playSound()

    // param phase
    if (frameCount % updateFrequency === 0) {
      chNode.update()
    }
    const base = analyser.analyze().reduce((a, b) => a + b) / analyser.bufferLength
    dotPresentation.wave = clamp((base - 0.3) * 10, 0, 2)

    // rendering phase
    chNode.render()
    presentationNode.render()
    screenNode.render()
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
    canvas.addEventListener('pointerdown', (e) => chNode.interact(e))
  }
}
