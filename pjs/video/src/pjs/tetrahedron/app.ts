import {
  adjustMobileCanvas,
  DrawRTHandle,
  FrameBuffer,
  getGL,
  ImageResolution,
  InputColorRenderingNode,
  OffscreenDrawNode,
} from 'graph-gl'
import { startRenderingLoop } from '../../lib/pipeline'
import { TetraChain } from './model/tetrahedron'
import { OrbitCamera } from '../../lib/camera'

export async function app() {
  const gl = getGL()
  gl.enable(gl.DEPTH_TEST)
  gl.depthFunc(gl.LEQUAL)
  gl.enable(gl.CULL_FACE)
  gl.cullFace(gl.BACK)

  const isMobile = window.innerWidth < window.innerHeight

  let resolution: ImageResolution

  if (isMobile) {
    adjustMobileCanvas()
    resolution = { width: window.innerWidth, height: window.innerHeight }
  } else {
    resolution = { width: 960, height: 576 }
  }

  const scene = new OffscreenDrawNode()
  scene.renderTarget = new DrawRTHandle(new FrameBuffer(resolution.width, resolution.height, { depth: true }))
  const tet = new TetraChain()
  scene.drawables = [tet]

  tet.position = [0, 0, 0]

  const cam = new OrbitCamera()
  tet.setProjectionMatrix(cam.getProjectionMatrix())

  const screen = new InputColorRenderingNode()
  screen.setInput(scene)

  window.addEventListener('keydown', (k) => {
    if (k.key === 'ArrowRight') {
      cam.phi += 0.1
    }
    if (k.key === 'ArrowLeft') {
      cam.phi -= 0.1
    }
  })

  function renderLoop(f: number) {
    // cam.phi += 0.1;
    // cam.r = Math.sin(performance.now() / 1000) * 10.0 + 15
    cam.r = 3.0
    tet.setViewMatrix(cam.getViewMatrix())

    scene.render()
    screen.render()
  }

  startRenderingLoop(renderLoop)
}
