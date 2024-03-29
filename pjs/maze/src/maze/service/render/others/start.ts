import { Conf } from '../../../config'
import { getPalette } from '../vision/color/palette'

const em = 32

export const renderStartPage = (packageVersion: string) => {
  const pg = p.createGraphics(Conf.ww, Conf.wh)
  pg.background(getPalette().fill)
  pg.textAlign(p.CENTER, p.CENTER)
  pg.stroke(255)
  pg.textSize(em)
  pg.text('MAZE', pg.width / 2, pg.height / 2)
  pg.textSize(0.5 * em)
  pg.fill(200)
  pg.text(`${packageVersion}`, pg.width / 2, pg.height - 2 * em)
  p.image(pg, 0, 0)
}
