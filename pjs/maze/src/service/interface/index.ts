export const openInterfaceLayer = () => {
  // const canvas = getCanvas()
  // canvas.style.visibility = 'visible'
}

export const closeInterfaceLayer = () => {
  // const canvas = getCanvas()
  // canvas.style.visibility = 'hidden'
}

export const clearInterfaceLayer = () => {
  p2d.loadPixels()
  p2d.pixels.forEach((_, i) => {
    p2d.pixels[i] = 0
  })
  p2d.updatePixels()
}

const getCanvas = () => {
  try {
    const canvasContainer = document.getElementById('canvas-p2d')!
    const canvas = canvasContainer.getElementsByTagName('canvas')
    return canvas[0]
  } catch (e) {
    throw Error(`failed to get 2d canvas`)
  }
}
