import { wh, ww } from '../../../config'
import { getPalette } from '../color/palette'

const em = 32

export const renderStartPage = (packageVersion: string) => {
  p2d.stroke(255)
  p2d.background(getPalette().fill)
  p2d.textAlign(p.CENTER, p.CENTER)
  p2d.textSize(em)
  p2d.text('MAZE', ww / 2, wh / 2)
  p2d.textSize(0.5 * em)
  p2d.fill(200)
  p2d.text(`${packageVersion}`, ww / 2, wh - 2 * em)
}
