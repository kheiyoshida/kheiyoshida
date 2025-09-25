import { getGL } from '../../gl/gl'
import { Message } from '../shinjuku/message'
import { startRenderingLoop, VideoProjectionPipeline } from '../../lib/pipeline'
import { DevVideoChannel, YoutubeVideoChannel } from './channel'
import { DevDotPresentation } from './presentation/dot'
import { LinePresentation } from './presentation/line'
import { fireByRate, randomIntInclusiveBetween } from 'utils'
import { saturationEffectFactory } from './effect/saturation'
import { CameraChannel } from '../../lib/channel/camera'
import { CameraInputSource } from '../../media/camera'
import { bindMidiInputMessage } from '../../media/midi/input'
import { LaunchControl } from '../../lib/params/launchControl'
import { ParamsManager } from '../../lib/params/manager'
import { ChannelManager } from '../../lib/channel/manager'
import { CubeRenderingChannel } from './channels/object'
import { GlyphPresentation } from './presentation/glyph'
import { MultiplyEffect } from './effect/multiply'
import { ChannelParamsControl } from './control/fader'
import { LinePresentationControl } from './control/knobs'

// config
const videoAspectRatio = 16 / 9
const frameBufferWidth = 960
const outputResolutionWidth = frameBufferWidth / 4
const backgroundColor: [number, number, number, number] = [0, 0, 0, 1]

export const app = async () => {
  // init gl
  getGL()

  // sound input control
  // const source = await createAudioInputSource()
  // const analyser = new SoundAnalyser(source, 32)

  // rendering
  const objectCh = new CubeRenderingChannel(
    {
      width: frameBufferWidth,
      height: frameBufferWidth / videoAspectRatio,
    },
    outputResolutionWidth
  )
  const videoCh = new DevVideoChannel(videoAspectRatio, frameBufferWidth, outputResolutionWidth)
  const youtubeCh = new YoutubeVideoChannel(videoAspectRatio, frameBufferWidth, outputResolutionWidth)

  const cameraName = 'Video Control'
  const cameraSource = await CameraInputSource.create()
  const cameraCh = new CameraChannel(cameraSource, videoAspectRatio, frameBufferWidth, outputResolutionWidth)

  const dotAspectRatio = 16 / 9
  const dotPresentation = new DevDotPresentation(videoCh.outputResolution, dotAspectRatio)
  dotPresentation.dotSize = 0.6
  const glyphPresentation = new GlyphPresentation(videoCh.outputResolution, dotAspectRatio)

  const linePresentation = new LinePresentation(videoCh.outputResolution)

  const channelManager = new ChannelManager([cameraCh])
  channelManager.channelNumber++

  // prettier-ignore
  const pipeline = new VideoProjectionPipeline(
    channelManager,
    [linePresentation],
    [
      saturationEffectFactory,
      // MultiplyEffect.factory(16),
      // TextOverlayEffect.factory(24)
    ]
  )
  pipeline.setBackgroundColor(backgroundColor)

  const channelParams = new ChannelParamsControl(channelManager)
  const params = new ParamsManager({
    knob: [new LinePresentationControl(linePresentation)],
    fader: channelParams,
  })
  const launchControl = new LaunchControl(params)
  await bindMidiInputMessage((m) => launchControl.handle(m))

  function renderLoop(frameCount: number) {
    // param phase
    objectCh.cube.rot[0] += 0.01
    objectCh.cube.rot[1] += 0.1
    objectCh.cube.offsets[randomIntInclusiveBetween(0, 7)] = [Math.random(), Math.random(), 0]

    // if (fireByRate(0.2)) {
    // (pipeline.postEffects[1] as MultiplyEffect).multiply = randomIntInclusiveBetween(1, 16);
    // }

    dotPresentation.dotSize = 0.44

    params.apply()

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
  await videoCh.waitForReady((progress) => (message.text = `loading: ${progress}%`))
  startRenderingLoop(renderLoop)
  message.hide()
}
