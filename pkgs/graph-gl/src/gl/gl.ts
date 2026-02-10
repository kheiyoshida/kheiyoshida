let gl: WebGL2RenderingContext

export const getGL = (): WebGL2RenderingContext => {
  if (gl) return gl

  const canvas = document.getElementById('canvas')! as HTMLCanvasElement

  gl = canvas.getContext('webgl2')!

  // Resize canvas to fill the screen
  canvas.width = window.innerWidth
  canvas.height = window.innerWidth / (16/9)
  gl.viewport(0, 0, canvas.width, canvas.height)

  return canvas.getContext('webgl2')!
}

export const adjustMobileCanvas = () => {
  const gl = getGL()

  const canvas = gl.canvas
  const dpr = window.devicePixelRatio

  canvas.width = window.innerWidth * dpr
  canvas.height = window.innerHeight * dpr
  gl.viewport(0, 0, canvas.width, canvas.height)
}
