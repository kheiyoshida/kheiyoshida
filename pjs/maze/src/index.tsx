import { getGL, resizeCanvas } from 'maze-gl/src/webgl'
import pjson from '../package.json'
import { initializeServices, setupRenderingCycle } from './service'
import { Interface } from './service/interface'
import { music } from './service/music'

const VERSION = pjson.version
let started = false

const start = () => {
  music.startContext()

  const gl = getGL()
  gl.enable(gl.DEPTH_TEST)
  resizeCanvas(window.innerWidth/2, window.innerHeight/2, window.innerWidth, window.innerHeight)

  if (started) return
  started = true
  initializeServices()
  setupRenderingCycle()
}

export default () => {
  return (
    <>
      <canvas id={'canvas'} />
      <Interface version={VERSION} start={start} />
    </>
  )
}
