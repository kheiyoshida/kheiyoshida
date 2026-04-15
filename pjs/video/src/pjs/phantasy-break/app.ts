import { Message } from '../shinjuku/message'
import { startRenderingLoop } from '../../lib/pipeline'
import { videoSourceList as shinjukuVideoSourceList } from '../shinjuku/videos'
import { DotPresentation } from './presentation/dot'
import { LinePresentation } from './presentation/line'
import { ColorEffect } from './effect/color'
import { CameraChannel } from '../../lib-node/channel/camera/camera'
import { CameraInputSource } from '../../media/camera'
import { bindMidiInputMessage } from '../../media/midi/input'
import { LaunchControl } from '../../lib/params/launchControl'
import { ParamsManager } from '../../lib/params/manager'
import { CubeRenderingChannel } from './channels/cube/object'
import { GlyphPresentation } from './presentation/glyph'
import { ChannelParamsControl } from './control/fader'
import {
  ChannelControl,
  ColorCapControl,
  ColorSaturationControl,
  DotPresentationControl,
  GlyphPresentationControl,
  InputControl,
  OutlinePresentationControl,
  PostEffectControl,
} from './control/knobs'
import { MultiplyEffectModel } from './effect/multiply'
import { TextPresentation } from './presentation/text'
import { ImageResolution } from '../../media/pixels/types'
import { createAudioInputSource } from '../../media/audio/input'
import { SoundLevel } from './control/soundLevel'
import { KaleidoscopeEffectModel } from './effect/kaleido'
import { DualShockKaleidoscopeShooterControl } from './control/shooter'
import { PS3DualShock } from '../../media/gamepad/ps3'
import { AATextData, AlphabetTextData, KatakanaTextData } from './text/textData'
import { DebugPresentation } from './presentation/debug'
import { DrawRTHandle, FrameBuffer, getGL, InputColorRenderingNode } from 'graph-gl'
import { ChannelManager } from '../../lib-node/channel/manager'
import { MultiChannelNode } from '../../lib-node/channel/node'
import { VideoChannel } from '../../lib-node/channel/channel'
import { cityVideoList, youtubeVideoList } from './channel'
import { AdditivePresentationNode, PresentationNode } from '../../lib-node/presentation/node'
import { ScreenEffectNode } from '../../lib-node/effect/node'
import { PixelDataRTHandle } from '../../lib-node/channel/target'
import { GreyScaleGradientNode } from './effect/greyscale/node'
import { OutlinePresentation } from './presentation/outline/presentation'
import { AfterImageNode } from './effect/afterimage/node'
import { TetrahedraChannel } from './channels/tetrahedra/channel'

// config
const videoAspectRatio = 16 / 9
const frameBufferWidth = 960
const outputResolutionWidth = 240 // frameBufferWidth / 4
const backgroundColor: [number, number, number, number] = [0.1, 0.1, 0.1, 1]

const videoSourceResolution: ImageResolution = {
  width: outputResolutionWidth,
  height: outputResolutionWidth / videoAspectRatio, // 135
}
const videoWidth = videoSourceResolution.width
const videoHeight = videoSourceResolution.height

const frameBufferResolution: ImageResolution = {
  width: frameBufferWidth,
  height: frameBufferWidth / videoAspectRatio,
}
const width = frameBufferResolution.width
const height = frameBufferResolution.height

export const app = async () => {
  // init gl
  const gl = getGL()

  gl.enable(gl.DEPTH_TEST)
  gl.depthFunc(gl.LEQUAL)
  gl.enable(gl.CULL_FACE)
  gl.cullFace(gl.BACK)

  // ask permission first
  const media = await navigator.mediaDevices.getUserMedia({ audio: true, video: true })
  console.log(media)

  // sound input control
  const deviceName = 'Zen Go'
  const soundLevel = new SoundLevel(await createAudioInputSource())

  // set up camera
  const cameraName = 'Video Control'
  const cameraSource = await CameraInputSource.create(cameraName)

  // channels
  const cameraCh = new CameraChannel(cameraSource)
  cameraCh.reverse(true)
  const tetraCh = new TetrahedraChannel()
  const objectCh = new CubeRenderingChannel()
  const shinjukuVideoCh = new VideoChannel(shinjukuVideoSourceList)
  const youtubeCh = new VideoChannel(youtubeVideoList)
  const cityCh = new VideoChannel(cityVideoList)

  const channelManager = new ChannelManager([tetraCh, objectCh, shinjukuVideoCh, youtubeCh, cityCh])
  const chNode = new MultiChannelNode(channelManager)
  chNode.renderTarget = new PixelDataRTHandle(new FrameBuffer(videoWidth, videoHeight, { depth: true }))
  chNode.backgroundColor = backgroundColor

  // greyscale
  const greyscaleNode = new GreyScaleGradientNode()
  greyscaleNode.renderTarget = new PixelDataRTHandle(new FrameBuffer(videoWidth, videoHeight))

  // presentations
  const linePresentation = new LinePresentation(chNode.outputResolution)
  const dotPresentation = new DotPresentation(chNode.outputResolution, 1)
  const outlinePresentation = new OutlinePresentation(
    videoSourceResolution,
    chNode.renderTarget.frameBuffer.colorTexture.tex,
    5
  )

  const aaTextData = new AATextData()
  const alphabetTextData = new AlphabetTextData('PHANTASY BREAK ')
  const katakanaTextData = new KatakanaTextData()
  const glyphPresentation = new GlyphPresentation(chNode.outputResolution, [
    aaTextData,
    alphabetTextData,
    katakanaTextData,
  ])

  const presentationNode = new PresentationNode([outlinePresentation, dotPresentation, glyphPresentation])

  // post effects
  const multiplyFx = new MultiplyEffectModel(16)
  const kaleidoscopeFx = new KaleidoscopeEffectModel(16)
  const fxNode = new ScreenEffectNode([multiplyFx, kaleidoscopeFx])

  // afterimage
  const afterImageNode = new AfterImageNode(frameBufferResolution)

  // post presentations
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

  const postPresentationNode = new AdditivePresentationNode([
    textPresentation,
    scorePresentation,
    debugPresentation,
  ])

  // final effects
  const colorFx = new ColorEffect()
  const finalFxNode = new ScreenEffectNode([colorFx])

  // screen
  const screenNode = new InputColorRenderingNode()

  // render graph

  const rtA = new DrawRTHandle(new FrameBuffer(width, height))
  const rtB = new DrawRTHandle(new FrameBuffer(width, height))

  greyscaleNode.setInput(chNode)

  presentationNode.renderTarget = rtA
  presentationNode.setPixelDataInput(chNode)
  presentationNode.setTextureInput(greyscaleNode)
  presentationNode.backgroundColor = backgroundColor

  fxNode.renderTarget = rtB
  fxNode.setInput(presentationNode)

  afterImageNode.renderTarget = rtA
  afterImageNode.setInput(fxNode)

  postPresentationNode.renderTarget = rtB
  postPresentationNode.setFrameInput(afterImageNode)
  postPresentationNode.setPixelDataInput(chNode) // TODO: make object node

  finalFxNode.renderTarget = rtA
  finalFxNode.setInput(postPresentationNode)

  screenNode.setInput(finalFxNode)
  // screenNode.setInput(afterImageNode.historyRT.frameBuffer)
  screenNode.backgroundColor = backgroundColor

  chNode.validate()
  greyscaleNode.validate()
  presentationNode.validate()
  fxNode.validate()
  postPresentationNode.validate()
  finalFxNode.validate()
  screenNode.validate()

  function renderGraph() {
    chNode.render()
    greyscaleNode.render()
    presentationNode.render()
    fxNode.render()
    afterImageNode.render()
    postPresentationNode.render()
    finalFxNode.render()
    screenNode.render()
  }

  // control
  const channelParams = new ChannelParamsControl(channelManager)
  const params = new ParamsManager({
    knob: [
      new ChannelControl(objectCh, soundLevel, debugPresentation, afterImageNode.afterImageFx), // 1
      new InputControl(cameraCh, glyphPresentation), // 2
      new OutlinePresentationControl(outlinePresentation), //3
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

  let dualshock: PS3DualShock | null
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
    outlinePresentation.setJitterLevel(effectLevel)
    objectCh.cube.scale.updateValue(effectLevel)
    objectCh.cube.scale.updateValue(effectLevel)
    objectCh.applyEffect(effectLevel)
    tetraCh.setLength(effectLevel)

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
    renderGraph()
  }

  // set up
  const message = new Message()

  message.text = 'loading...'
  await shinjukuVideoCh.waitForReady((progress) => (message.text = `loading ch 3: ${progress}%`))
  await youtubeCh.waitForReady((progress) => (message.text = `loading ch 4: ${progress}%`))
  await cityCh.waitForReady((progress) => (message.text = `loading ch 5: ${progress}%`))

  kaleidoscopeFx.enabled = false
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
