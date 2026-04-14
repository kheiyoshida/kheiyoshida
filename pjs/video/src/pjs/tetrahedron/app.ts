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
import { TetraGraph } from './model/tetrahedron'
import { OrbitCamera, OrbitCameraControl } from '../../lib/camera'
import { DistortionNode, EdgeDrawNode } from './nodes/edge/node'

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
    const canvas = getGL().canvas!
    const ratio = canvas.height / canvas.width
    const w = 380
    resolution = { width: w, height: w * ratio }
  } else {
    resolution = { width: 960, height: 576 }
  }

  const scene = new OffscreenDrawNode()
  scene.renderTarget = new DrawRTHandle(new FrameBuffer(resolution.width, resolution.height, { depth: true, normal: true }))
  const tet = new TetraGraph(3)
  const tet2 = new TetraGraph(3)
  scene.drawables = [tet, tet2]
  scene.backgroundColor = [0.1, 0.1, 0.1, 1]

  tet.position = [-2, 0, 0]
  tet2.position = [2, 0, 0]

  const cam = new OrbitCamera()
  tet.setProjectionMatrix(cam.getProjectionMatrix())
  tet2.setProjectionMatrix(cam.getProjectionMatrix())

  const edge = new EdgeDrawNode()
  edge.renderTarget = new DrawRTHandle(new FrameBuffer(resolution.width, resolution.height))
  edge.setInput(scene)

  const dist = new DistortionNode()
  dist.renderTarget = new DrawRTHandle(new FrameBuffer(resolution.width, resolution.height))
  dist.setInput(edge)

  const screen = new InputColorRenderingNode()
  screen.setInput(dist)


  const control = new OrbitCameraControl(cam, document.body)

  let interactiveMode = false;
  window.addEventListener('pointerdown', (k) => {
    interactiveMode = true;
  })

  function renderLoop(f: number) {
    if (!interactiveMode) {
      cam.theta += 0.001;
      cam.phi = Math.sin(performance.now() / 5000) * Math.PI/2;
      cam.r = Math.sin(performance.now() / 2000) * 10.0 + 13
    }

    const s = (Math.sin(performance.now() / 1000) + 1) / 2.0
    tet.setScale(0.1 + s * 0.8)
    tet.setLength(Math.floor(s * 200))

    const s2 = (Math.cos(performance.now() / 1000) + 1) / 2.0
    tet2.setScale(0.1 + s2 * 0.8)
    tet2.setLength(Math.floor(s2 * 80))
    //
    tet.setViewMatrix(cam.getViewMatrix())
    tet2.setViewMatrix(cam.getViewMatrix())

    scene.render()
    edge.render()
    dist.render()
    screen.render()
  }

  startRenderingLoop(renderLoop)
}
