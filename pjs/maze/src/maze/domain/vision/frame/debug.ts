import { pushPop } from 'p5utils/src/lib/p5utils'
import { Frame } from '.'

export const debugFrames = (frames: Frame[]) => {
  pushPop(() => {
    p.strokeWeight(5)
    p.textSize(20)
    frames.forEach((f, i) => {
      p.stroke(200,0,255- i * 20, 255- i * 20)
      p.text(`${i}`, f.tl[0], f.tl[1])
      Object.values(f).forEach((pt) => p.point(pt[0], pt[1]))
    })
  })
}
