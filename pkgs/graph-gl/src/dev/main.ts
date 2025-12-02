// config
import { ImageResolution, InputColorRenderingNode, OffscreenDrawNode, OnscreenRenderingNode } from '../graph'
import { FullFrameBuffer, FrameBuffer, getGL } from '../gl'
import { CubeModel } from './cube/cube'
import { getView } from './view'

const videoAspectRatio = 16 / 9
const frameBufferWidth = 960
const outputResolutionWidth = frameBufferWidth / 4
const backgroundColor: [number, number, number, number] = [0.1, 0, 0, 1]

const frameBufferResolution: ImageResolution = {
  width: frameBufferWidth,
  height: frameBufferWidth / videoAspectRatio,
}
const width = frameBufferResolution.width
const height = frameBufferResolution.height

// init gl
const gl = getGL()
gl.enable(gl.DEPTH_TEST)

// source
const cube = new CubeModel()
cube.shader.use()
const [view, projection] = getView()
cube.shader.setUniformMatrix4('uProjection', projection)
cube.shader.setUniformMatrix4('uView', view)

cube.wireframe = true
const sourceNode = new OffscreenDrawNode()
sourceNode.backgroundColor = backgroundColor
sourceNode.drawables = [cube]
sourceNode.renderTarget = { frameBuffer: new FullFrameBuffer(width, height) }

// screen
const screenNode = new InputColorRenderingNode()
screenNode.setInput(sourceNode)
screenNode.backgroundColor = backgroundColor

function render() {
  cube.rotate(0.01)
  sourceNode.render()
  screenNode.render()
  requestAnimationFrame(render)
}
requestAnimationFrame(render)
