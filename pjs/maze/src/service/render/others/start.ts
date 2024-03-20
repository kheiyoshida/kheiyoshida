import { wh, ww } from '../../../config'
import { getPalette } from '../color/palette'

const em = 32

export const renderStartPage = (packageVersion: string) => {
  const pg = p.createGraphics(ww, wh)
  pg.stroke(255)
  pg.background(getPalette().fill)

  pg.textAlign(p.CENTER, p.CENTER)
  pg.textSize(em)
  pg.text('MAZE', pg.width / 2, pg.height / 2)
  pg.textSize(0.5 * em)
  pg.fill(200)
  pg.text(`${packageVersion}`, pg.width / 2, pg.height - 2 * em)
  p.image(pg, -ww / 2, -wh / 2)
}
