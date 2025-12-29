import { getGL, resizeCanvas } from '../runtime/webgl'
import { renderScene, Scene } from '../'
import { makeRenderer } from '../runtime'
import { toRadians } from '../utils/calc'
import { getDebugScene } from './debugScene'

const gl = getGL()
gl.enable(gl.DEPTH_TEST)
resizeCanvas(window.innerWidth, window.innerHeight, window.innerWidth, window.innerHeight)

let eyeX = 0
let eyeY = 0
let eyeZ = 3000

const resolution: [number, number] = [gl.canvas.width, gl.canvas.height]

const debugScene = getDebugScene()

function frame(frameCount: number) {
  const scene: Scene = {
    ...debugScene,
    eye: {
      sight: 8000,
      fov: toRadians(60),
      position: [eyeX, eyeY, eyeZ],
      direction: 0,
      aspectRatio: window.innerWidth / window.innerHeight,
    },
    effect: {
      time: performance.now(),
      resolution: resolution,
      edge: {
        edgeRenderingLevel: 1.0,
      },
      fog: {
        fogLevel: 1.0
      },
      blur: {
        blurLevel: 5
      },
      distortion: {
        distortionLevel: 1
      },
      fade: {
        fadeLevel: 0.0
      }
    },
  }

  renderScene(scene)
}

window.addEventListener('keydown', (e) => {
  if (e.key === 'w') eyeZ -= 100
  if (e.key === 's') eyeZ += 100
  if (e.key === 'd') eyeX += 100
  if (e.key === 'a') eyeX -= 100
  if (e.key === 'e') eyeY += 100
  if (e.key === 'q') eyeY -= 100
})

const renderer = makeRenderer(30)
renderer.start(frame)
