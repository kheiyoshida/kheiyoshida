import { DrawRTHandle, FrameBuffer, getGL, InputColorRenderingNode, OffscreenDrawNode } from 'graph-gl'
import cube from '../../lib/objects/cube.obj?raw'
import { vec3 } from 'gl-matrix'
import { Camera } from '../../lib/camera.ts'
import { DepthRenderingModel } from './model.ts'
import { parseObjData } from '../../lib/model/parse.ts'
import { DepthEffectNode } from './effect.ts'

export async function app() {
  const gl = getGL()

  gl.enable(gl.DEPTH_TEST)
  gl.depthFunc(gl.LEQUAL)
  gl.enable(gl.CULL_FACE)
  gl.cullFace(gl.BACK)

  const sceneTarget = new DrawRTHandle(
    new FrameBuffer(gl.canvas.width, gl.canvas.height, { depth: true, normal: true })
  )

  const sceneNode = new OffscreenDrawNode()
  sceneNode.renderTarget = sceneTarget

  const objects: DepthRenderingModel[] = []

  const floor = new DepthRenderingModel(parseObjData(cube))
  floor.scale = vec3.fromValues(10.0, 0.1, 10.0)
  floor.position = vec3.fromValues(0, -0.3, 0)
  objects.push(floor)

  const roof = new DepthRenderingModel(parseObjData(cube))
  roof.scale = vec3.fromValues(10.0, 0.1, 10.0)
  roof.position = vec3.fromValues(0, 0.3, 0)
  objects.push(roof)

  for (let x = -1; x <= 1; x++) {
    if (x === 0) continue
    for (let z = 0; z < 10; z++) {
      const pillar = new DepthRenderingModel(parseObjData(cube))
      pillar.scale = vec3.fromValues(0.5, 0.8, 0.5)
      pillar.position = vec3.fromValues(x * 0.8, 0, z)
      objects.push(pillar)
    }
  }

  sceneNode.drawables = objects

  const effectNode = new DepthEffectNode()
  effectNode.enabled = true
  effectNode.renderTarget = new DrawRTHandle(new FrameBuffer(gl.canvas.width, gl.canvas.height))
  effectNode.setInput(sceneNode, sceneNode.renderTarget.frameBuffer)

  const screenNode = new InputColorRenderingNode()
  screenNode.setInput(effectNode)

  const camera = new Camera()

  camera.position = vec3.fromValues(0, 0, 3)

  const keys: Record<string, boolean> = {}
  window.onkeydown = (e) => (keys[e.key] = true)
  window.onkeyup = (e) => (keys[e.key] = false)

  function render() {
    if (keys['w'] || keys['ArrowUp']) {
      camera.proceed()
    }
    if (keys['a'] || keys['ArrowLeft']) {
      camera.rotateLeft()
    }
    if (keys['d'] || keys['ArrowRight']) {
      camera.rotateRight()
    }

    const t = performance.now() / 10000

    // todo: bulk update view matrix
    for (const object of objects) {
      object.setTme(t)
      object.setViewMatrix(camera.getViewMatrix())
      object.setProjectionMatrix(camera.getProjectionMatrix())
    }

    camera.getViewMatrix()

    gl.depthMask(true)
    sceneNode.render()
    effectNode.render()
    screenNode.render()
    requestAnimationFrame(render)
  }

  requestAnimationFrame(render)
}
