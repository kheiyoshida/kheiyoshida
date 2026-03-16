import { getGL, OnscreenRenderingNode } from 'graph-gl'
import cube from '../../lib/objects/cube.obj?raw'
import dodecahedron from '../../lib/objects/dodecahedron.obj?raw'
import { vec3 } from 'gl-matrix'
import { Camera } from '../../lib/camera.ts'
import { parseObjData } from '../../lib/model/parse.ts'
import { ParticleModel } from './model.ts'
import { ModelBase } from '../../lib/model/model.ts'

export async function app() {
  const gl = getGL()

  gl.enable(gl.DEPTH_TEST)
  gl.depthFunc(gl.LEQUAL)
  gl.enable(gl.CULL_FACE)
  gl.cullFace(gl.BACK)

  const sceneNode = new OnscreenRenderingNode()
  sceneNode.backgroundColor = [0.0, 0.0, 0.0, 1.0]

  const particleObj = new ParticleModel(parseObjData(dodecahedron), parseObjData(cube))
  const cubeObj = new ModelBase(parseObjData(cube))
  sceneNode.drawables = [particleObj]

  const camera = new Camera()

  camera.position = vec3.fromValues(0, 0, 5)

  const keys: Record<string, boolean> = {}
  window.onkeydown = (e) => (keys[e.key] = true)
  window.onkeyup = (e) => (keys[e.key] = false)

  camera.speed = 0.1
  camera.rotSpeed = 0.8

  function render() {
    if (keys['w'] || keys['ArrowUp']) {
      camera.proceed(true)
    }
    if (keys['a'] || keys['ArrowLeft']) {
      camera.rotateLeft()
    }
    if (keys['d'] || keys['ArrowRight']) {
      camera.rotateRight()
    }
    if (keys['s'] || keys['ArrowDown']) {
      camera.proceed(false)
    }

    particleObj.setTime(performance.now() / 100000)
    particleObj.setViewMatrix(camera.getViewMatrix())
    particleObj.setProjectionMatrix(camera.getProjectionMatrix())

    cubeObj.setViewMatrix(camera.getViewMatrix())
    cubeObj.setProjectionMatrix(camera.getProjectionMatrix())

    gl.depthMask(true)
    sceneNode.render()
    requestAnimationFrame(render)
  }

  requestAnimationFrame(render)
}
