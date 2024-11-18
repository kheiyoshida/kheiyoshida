import { getGL, resizeCanvas } from 'maze-gl/src/webgl'
import pjson from '../package.json'
import { initializeServices, setupRenderingCycle } from './service'
import { Interface } from './service/interface'
import { music } from './service/music'

// const setup = () => {
//   p.createCanvas(ww, wh, p.WEBGL)
//   p.textureMode(p.NORMAL)
//   p.angleMode(p.DEGREES)
//   p.perspective(FovyValue, ww / wh, 10, 8000)
//   p.frameRate(FPS)
//   p.fill(120)
//   p.stroke(0)
//
//   // TODO: replace with native event
//   p.mouseClicked = start
//   p.touchStarted = start
// }

const VERSION = pjson.version
let started = false

const start = () => {
  music.startContext()

  const gl = getGL()
  gl.enable(gl.DEPTH_TEST)
  resizeCanvas(window.innerWidth, window.innerHeight, window.innerWidth, window.innerHeight)

  if (started) return
  started = true
  setupRenderingCycle()
  initializeServices()
}

export default () => {
  return (
    <>
      {/*<Maze />*/}
      <Interface version={VERSION} start={start} />
    </>
  )
}
