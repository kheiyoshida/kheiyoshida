export const clearInterfaceLayer = () => {
  p2d.loadPixels()
  p2d.pixels.forEach((_, i) => {
    p2d.pixels[i] = 0
  })
  p2d.updatePixels()
}
