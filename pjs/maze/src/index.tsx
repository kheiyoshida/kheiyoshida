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
