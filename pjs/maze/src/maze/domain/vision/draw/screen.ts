import { pushPop } from 'src/lib/p5utils'

export const screenPaint = () => {
  pushPop(() => {
    p.noStroke()
    p.rect(
      -p.windowWidth,
      -p.windowHeight,
      3 * p.windowWidth,
      3 * p.windowHeight
    )
  })
}
