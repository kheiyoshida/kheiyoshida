import { getGL } from '../../gl/gl'
import { Message } from '../shinjuku/message'
import { startRenderingLoop, VideoProjectionPipeline } from '../../lib/pipeline'
import { CityChannel, DevVideoChannel, YoutubeVideoChannel } from './channel'
import { DotPresentation } from './presentation/dot'
import { LinePresentation } from './presentation/line'
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
  InputControl,
  LinePresentationControl,
  PostEffectControl,
} from './control/knobs'
import { MultiplyEffectModel } from './effect/multiply'
import { EffectSlot } from '../../lib/effect/slot'
import { TextPresentation } from './presentation/text'
import { ImageResolution } from '../../media/pixels/types'
import { createAudioInputSource } from '../../media/audio/input'
import { SoundLevel } from './control/soundLevel'
import { KaleidoscopeEffectModel } from './effect/kaleido'
import { DualShockKaleidoscopeShooterControl } from './control/shooter'
import { PS3DualShock } from '../../media/gamepad/ps3'
import { AATextData, AlphabetTextData, KatakanaTextData } from './text/textData'
import { DebugPresentation } from './presentation/debug'

// config
const videoAspectRatio = 16 / 9
const frameBufferWidth = 960
const outputResolutionWidth = frameBufferWidth / 4
const backgroundColor: [number, number, number, number] = [0, 0, 0, 1]

export const app = async () => {
  // init gl
  getGL()

  // sound input control
  const soundLevel = new SoundLevel(await createAudioInputSource('Zen Go'))

  const frameBufferResolution: ImageResolution = {
    width: frameBufferWidth,
    height: frameBufferWidth / videoAspectRatio,
  }

  // rendering
  const objectCh = new CubeRenderingChannel(frameBufferResolution, outputResolutionWidth)
  const shinjukuVideoCh = new DevVideoChannel(videoAspectRatio, frameBufferWidth, outputResolutionWidth)
  const youtubeCh = new YoutubeVideoChannel(videoAspectRatio, frameBufferWidth, outputResolutionWidth)
  const cityCh = new CityChannel(videoAspectRatio, frameBufferWidth, outputResolutionWidth)

  const cameraName = 'Video Control'
  const cameraSource = await CameraInputSource.create(cameraName)
  const cameraCh = new CameraChannel(cameraSource, videoAspectRatio, frameBufferWidth, outputResolutionWidth)
  cameraCh.reverse(true)

  const dotPresentation = new DotPresentation(shinjukuVideoCh.outputResolution, 1)

  const aaTextData = new AATextData()
  const alphabetTextData = new AlphabetTextData('PHANTASY BREAK ')
  const katakanaTextData = new KatakanaTextData()

  const glyphPresentation = new GlyphPresentation(shinjukuVideoCh.outputResolution, [
    aaTextData,
    alphabetTextData,
    katakanaTextData,
  ])

  const linePresentation = new LinePresentation(shinjukuVideoCh.outputResolution)

  //channels
  const channelManager = new ChannelManager([cameraCh, objectCh, shinjukuVideoCh, youtubeCh, cityCh])

  const colorFx = new ColorEffect()
  const multiplyFx = new MultiplyEffectModel(16)
  const kaleidoscopeFx = new KaleidoscopeEffectModel(16)

  const textPresentation = new TextPresentation(frameBufferResolution, 50)
  textPresentation.fontSize = 6
  textPresentation.posY = 540 - 16
  textPresentation.setText('PHANTASY BREAK')

  const scorePresentation = new TextPresentation(frameBufferResolution, 50)
  scorePresentation.fontSize = 8
  scorePresentation.posY = 500

  // we're not showing unless it's shooter mode
  textPresentation.enabled = false
  scorePresentation.enabled = false

  const debugPresentation = new DebugPresentation(frameBufferResolution, 50)
  debugPresentation.fontSize = 8
  debugPresentation.posX = 180
  debugPresentation.posY = 40

  // prettier-ignore
  const pipeline = new VideoProjectionPipeline(
    frameBufferResolution,
    channelManager,
    [linePresentation, dotPresentation, glyphPresentation],
    [
      new EffectSlot([kaleidoscopeFx, multiplyFx]),
    ],
    [textPresentation, scorePresentation, debugPresentation],
    new EffectSlot([colorFx])
  )
  pipeline.setBackgroundColor(backgroundColor)

  // control
  const channelParams = new ChannelParamsControl(channelManager)
  const params = new ParamsManager({
    knob: [
      new ChannelControl(objectCh, soundLevel, debugPresentation), // 1
      new InputControl(cameraCh, glyphPresentation), // 2
      new LinePresentationControl(linePresentation), //3
      new DotPresentationControl(dotPresentation), // 4
      new GlyphPresentationControl(glyphPresentation), // 5
      new PostEffectControl(multiplyFx), // 6
      new ColorSaturationControl(colorFx), // 7
      new ColorCapControl(colorFx), // 8
    ],
    fader: channelParams,
  })
  const launchControl = new LaunchControl(params)
  await bindMidiInputMessage((m) => launchControl.handle(m))

  let dualshock = await PS3DualShock.Connect()
  let shooterControl: DualShockKaleidoscopeShooterControl

  let score = 0
  function renderLoop(frameCount: number) {
    // param phase
    params.apply()

    // sound level
    const effectLevel = soundLevel.getSoundLevel()
    linePresentation.updateParams(effectLevel)
    dotPresentation.dotSize.updateValue(effectLevel)
    dotPresentation.densityX.updateValue(effectLevel)
    dotPresentation.densityY.updateValue(effectLevel)
    glyphPresentation.dotSize.updateValue(effectLevel)
    objectCh.cube.scale.updateValue(effectLevel)
    objectCh.cube.scale.updateValue(effectLevel)
    objectCh.applyEffect(effectLevel)

    kaleidoscopeFx.numOfTriangles = 4 + Math.floor(2 * effectLevel)

    if (dualshock && shooterControl) {
      shooterControl.pollInput()
      shooterControl.submitControlValues()
    }

    if (effectLevel > 0.5) {
      score += Math.floor(effectLevel * 10)
      scorePresentation.setText(score.toString())
    }

    if (effectLevel > 0.3) {
      multiplyFx.randomiseMultiply(effectLevel)
    }

    // debug
    if (debugPresentation.enabled) {
      debugPresentation.soundLevel = effectLevel
      debugPresentation.chNumber = channelManager.channelNumber
      debugPresentation.cameraAvailable = cameraCh.isAvailable
      debugPresentation.updateDebugText()
    }

    // rendering phase
    pipeline.render()
  }

  // set up
  const message = new Message()

  message.text = 'loading...'
  await shinjukuVideoCh.waitForReady((progress) => (message.text = `loading: ${progress}%`))
  await youtubeCh.waitForReady((_) => undefined)
  document.body.onclick = async (e) => {
    if (!dualshock) {
      dualshock = await PS3DualShock.Connect()
    }
    shooterControl = new DualShockKaleidoscopeShooterControl(kaleidoscopeFx, dualshock!, (flag) => {
      textPresentation.enabled = flag
      scorePresentation.enabled = flag
    })
  }
  startRenderingLoop(renderLoop)
  message.hide()
}
