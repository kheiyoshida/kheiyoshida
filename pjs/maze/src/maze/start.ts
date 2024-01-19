import { pushPop } from 'p5utils/src/lib/p5utils'
import { VERSION } from './version'

const em = 32

export const renderStartPage = () => {
  pushPop(() => {
    p.textAlign(p.CENTER, p.CENTER)
    p.stroke(255)
    p.text('MAZE', p.width / 2, p.height / 2)

    p.textSize(14)
    p.fill(200)
    p.text(`${VERSION}`, p.width / 2, p.height - 2 * em)
  })
}
