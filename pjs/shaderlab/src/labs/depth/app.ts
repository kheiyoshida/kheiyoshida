import { DrawRTHandle, FrameBuffer, InputColorRenderingNode, OffscreenDrawNode } from 'graph-gl'
import cube from '../../lib/objects/cube.obj?raw'
import { ModelBase } from '../../lib/model/model.ts'
import { vec3 } from 'gl-matrix'
import { Camera } from '../../lib/camera.ts'

export async function app() {
  const rt = new DrawRTHandle(new FrameBuffer(window.innerWidth, window.innerHeight))

  const offscreenNode = new OffscreenDrawNode()
  offscreenNode.renderTarget = rt

  const cubeObject = ModelBase.build(cube)
  cubeObject.scale = vec3.fromValues(0.1, 0.1, 0.1)

  offscreenNode.drawables = [cubeObject]

  const screenNode = new InputColorRenderingNode()
  screenNode.setInput(offscreenNode)

  const camera = new Camera()

  function render() {
    // todo: bulk update view matrix
    camera.position = vec3.fromValues(0, 0, 0.5)
    cubeObject.rotation = vec3.fromValues(0, performance.now() * 0.1, 0)
    cubeObject.setViewMatrix(camera.getViewMatrix())
    cubeObject.setProjectionMatrix(camera.getProjectionMatrix())

    camera.getViewMatrix()
    offscreenNode.render()
    screenNode.render()
    requestAnimationFrame(render)
  }

  requestAnimationFrame(render)
}
