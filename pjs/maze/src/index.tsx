import { getGL, resizeCanvas } from 'maze-gl'
import pjson from '../package.json'
import { initializeServices, setupRenderingCycle } from './service'
import { Interface } from './service/interface'
import { musicContext } from './service/music'
import { logicalHeight, logicalWidth } from './config'

const VERSION = pjson.version
let started = false

const start = () => {
  musicContext.startContext()

  const gl = getGL()
  gl.enable(gl.DEPTH_TEST)

  resizeCanvas(logicalWidth, logicalHeight, window.innerWidth, window.innerHeight)

  if (started) return
  started = true
  initializeServices()
  setupRenderingCycle()
}

export default () => {
  return (
    <div style={styles.canvasContainer}>
      <canvas id={'canvas'} />
      <Interface version={VERSION} start={start} />
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  canvasContainer: {
    zIndex: 10,
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100dvh',
    overflow: 'hidden',
    backgroundColor: 'black',
    margin: '0 auto',
    touchAction: 'manipulation',
    overflowX: 'hidden',
    overflowY: 'hidden',
    overscrollBehavior: 'none',
  },
}

export { Actor } from './core/actor/actor.ts'
