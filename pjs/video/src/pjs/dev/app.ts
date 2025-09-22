import { getGL } from '../../gl/gl'
import { Message } from '../shinjuku/message'
import { startRenderingLoop, VideoProjectionPipeline } from '../../lib/pipeline'
import { DevVideoChannel } from './channel'
import { DevDotPresentation } from './presentation'
import { DevLinePresentation } from './presentation/line'
import { KaleidoscopeEffect } from './effect/kaleido'
import { fireByRate, pipe, randomIntInclusiveBetween } from 'utils'
import { saturationEffectFactory } from './effect/saturation'
import { CameraChannel } from '../../lib/channel/camera'
import { CameraInputSource } from '../../media/camera'
import { createAudioInputSource } from '../../media/audio/input'
import { SoundAnalyser } from '../../media/audio/analyzer'
import { bindMidiInputMessage } from '../../media/midi/input'
import { LaunchControl } from '../../lib/params/launchControl'
import { ParamsManager } from '../../lib/params/manager'

// config
const videoAspectRatio = 16 / 9
const frameBufferWidth = 960
const outputResolutionWidth = frameBufferWidth / 4
const backgroundColor: [number, number, number, number] = [0, 0, 0, 1]

export const app = async () => {
  // init gl
  getGL()

  const params = new ParamsManager({ knob: []})
  const launchControl = new LaunchControl(params)
  await bindMidiInputMessage(m => launchControl.handle(m))

  // sound input control
  // const source = await createAudioInputSource()
  // const analyser = new SoundAnalyser(source, 32)

  // rendering
  const channel = new DevVideoChannel(videoAspectRatio, frameBufferWidth, outputResolutionWidth)

  const cameraName = 'Video Control'
  const cameraSource = await CameraInputSource.create()
  const cameraCh = new CameraChannel(cameraSource, videoAspectRatio, frameBufferWidth, outputResolutionWidth)

  const dotAspectRatio = 16 / 9
  const dotPresentation = new DevDotPresentation(channel.outputResolution, dotAspectRatio)
  dotPresentation.dotSize = 0.6

  const linePresentation = new DevLinePresentation(channel.outputResolution)

  const pipeline = new VideoProjectionPipeline([channel, cameraCh], [linePresentation], [saturationEffectFactory])
  // pipeline.channelNumber ++
  pipeline.setBackgroundColor(backgroundColor)

  function renderLoop(frameCount: number) {
    // param phase
    // const rms = analyser.getRMS()
    // const effectLevel = Math.floor((1 - rms) * 50)
    // linePresentation.setMaxDistance(effectLevel)

    // if (fireByRate(0.1)) {
    //   (pipeline.postEffects[0] as KaleidoscopeEffect).startAngle = randomIntInclusiveBetween(0, 360)
    // }
    // if (fireByRate(0.01)) {
    //   (pipeline.postEffects[0] as KaleidoscopeEffect).numOfTriangles = randomIntInclusiveBetween(4, 12)
    // }

    // rendering phase
    pipeline.render()
  }

  // set up
  const message = new Message()

  message.text = 'loading...'
  await channel.waitForReady((progress) => (message.text = `loading: ${progress}%`))
  startRenderingLoop(renderLoop)
  message.hide()
}
