import { getGL } from '../../gl/gl'
import { Message } from '../shinjuku/message'
import { startRenderingLoop, VideoProjectionPipeline } from '../../lib/pipeline'
import { DevVideoChannel, YoutubeVideoChannel } from './channel'
import { DotPresentation } from './presentation/dot'
import { LinePresentation } from './presentation/line'
import { fireByRate, randomIntInclusiveBetween } from 'utils'
import { ColorEffect } from './effect/saturation'
import { CameraChannel } from '../../lib/channel/camera'
import { CameraInputSource } from '../../media/camera'
import { bindMidiInputMessage } from '../../media/midi/input'
import { LaunchControl } from '../../lib/params/launchControl'
import { ParamsManager } from '../../lib/params/manager'
import { ChannelManager } from '../../lib/channel/manager'
import { CubeRenderingChannel } from './channels/object'
import { GlyphPresentation } from './presentation/glyph'
import { ChannelParamsControl } from './control/fader'
import {
  ChannelControl,
  ColorCapControl,
  ColorSaturationControl,
  DotPresentationControl,
  GlyphPresentationControl,
  LinePresentationControl,
  PostEffectControl,
} from './control/knobs'
import { MultiplyEffectModel } from './effect/multiply'
import { EffectSlot } from '../../lib/effect/slot'
import { TextPresentation } from './presentation/text'
import { ImageResolution } from '../../media/pixels/types'
import { createAudioInputSource } from '../../media/audio/input'
import { SoundAnalyser } from '../../media/audio/analyzer'

// config
const videoAspectRatio = 16 / 9
const frameBufferWidth = 960
const outputResolutionWidth = frameBufferWidth / 4
const backgroundColor: [number, number, number, number] = [0, 0, 0, 1]

export const app = async () => {
  // init gl
  getGL()

  // sound input control
  const source = await createAudioInputSource()
  const analyser = new SoundAnalyser(source, 32)

  const frameBufferResolution: ImageResolution = {
    width: frameBufferWidth,
    height: frameBufferWidth / videoAspectRatio,
  }

  // rendering
  const objectCh = new CubeRenderingChannel(frameBufferResolution, outputResolutionWidth)
  const videoCh = new DevVideoChannel(videoAspectRatio, frameBufferWidth, outputResolutionWidth)
  const youtubeCh = new YoutubeVideoChannel(videoAspectRatio, frameBufferWidth, outputResolutionWidth)

  const cameraName = 'Video Control'
  const cameraSource = await CameraInputSource.create()
  const cameraCh = new CameraChannel(cameraSource, videoAspectRatio, frameBufferWidth, outputResolutionWidth)

  const dotPresentation = new DotPresentation(videoCh.outputResolution, 1)

  const glyphPresentation = new GlyphPresentation(videoCh.outputResolution, 1)

  const linePresentation = new LinePresentation(videoCh.outputResolution)

  //
  const channelManager = new ChannelManager([cameraCh, videoCh, youtubeCh, objectCh])

  const colorFx = new ColorEffect()
  const multiplyFx = new MultiplyEffectModel(16)

  const textPresentation = new TextPresentation({ width: 960, height: 540 }, 50)
  textPresentation.fontSize = 6
  textPresentation.posY = 540 - 16
  textPresentation.setText('PHANTASY BREAK')

  const scorePresentation = new TextPresentation({ width: 960, height: 540 }, 50)
  scorePresentation.fontSize = 8
  scorePresentation.posY = 500

  // prettier-ignore
  const pipeline = new VideoProjectionPipeline(
    frameBufferResolution,
    channelManager,
    [dotPresentation, glyphPresentation],
    [
      new EffectSlot([multiplyFx]),
      // new EffectSlot([colorFx]),
    ],
    [textPresentation, scorePresentation],
    new EffectSlot([colorFx])
  )
  pipeline.setBackgroundColor(backgroundColor)

  // control
  const channelParams = new ChannelParamsControl(channelManager)
  const params = new ParamsManager({
    knob: [
      new ChannelControl(objectCh), // 1
      new LinePresentationControl(linePresentation), //2
      new DotPresentationControl(dotPresentation), // 3
      new GlyphPresentationControl(glyphPresentation), // 4
      new PostEffectControl(multiplyFx), // 5
      new PostEffectControl(multiplyFx), // 6
      new ColorCapControl(colorFx), // 7
      new ColorSaturationControl(colorFx), // 8
    ],
    fader: channelParams,
  })
  const launchControl = new LaunchControl(params)
  await bindMidiInputMessage((m) => launchControl.handle(m))

  objectCh.update = (cube) => {
    cube.rot[0] += 0.01
    cube.rot[1] += 0.1
    cube.offsets[randomIntInclusiveBetween(0, 7)] = [Math.random(), Math.random(), 0]
  }

  let score = 0
  function renderLoop(frameCount: number) {
    // param phase
    params.apply()

    // sound level
    const decibels = analyser.getDecibels()
    const maxLoudness = -3
    const effectLevel = Math.min(1, Math.abs(decibels / maxLoudness))

    const rand = (Math.sin(frameCount * 0.1) + 1) / 2
    linePresentation.updateParams(rand)

    dotPresentation.dotSize.updateValue(effectLevel)
    dotPresentation.densityX.updateValue(effectLevel)
    dotPresentation.densityY.updateValue(effectLevel)

    if (fireByRate(0.1)) {
      score += Math.floor(Math.random() * 5) * 100
      scorePresentation.setText(score.toString())
    }



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
