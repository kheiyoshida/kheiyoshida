export { getGL } from 'graph-gl'
import { getGL } from 'graph-gl'

const getCanvasElement = (canvasId: string = 'canvas') => {
  const canvas = document.getElementById(canvasId)
  if (!canvas) {
    throw Error(`canvas not found`)
  }
  return canvas as HTMLCanvasElement
}

/**
 * explicitly set the default canvas's logical & physical size
 *
 * @param pxWidth number of columns of pixels
 * @param pxHeight number of columns of pixels
 * @param clientWidth client device's canvas width
 * @param clientHeight client device's canvas height
 */
export const resizeCanvas = (
  pxWidth: number,
  pxHeight: number,
  clientWidth: number,
  clientHeight: number
) => {
  const canvas = getCanvasElement()
  canvas.setAttribute('width', pxWidth.toString())
  canvas.setAttribute('height', pxHeight.toString())
  canvas.setAttribute('style', `width: ${clientWidth.toString()}px; height: ${clientHeight.toString()}px;`)
  getGL().viewport(0, 0, canvas.width, canvas.height)
}

export const setupMazeGL = () => {
  const gl = getGL()
  gl.enable(gl.DEPTH_TEST)
}
