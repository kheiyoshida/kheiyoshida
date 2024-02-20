import { Analyzer } from 'p5utils/src/media/audio/types'
import { pushPop } from 'p5utils/src/render'
import { clamp, makeIntWobbler } from 'utils'
import { LocBrightness } from '.'

const finalPixelSize =
  (rate: number) =>
  (pxw: number, pxh: number): [number, number] => [pxw * rate, pxh * rate]

export const drawMatrix = (
  brighnessSnapshot: LocBrightness[],
  { pxw, pxh }: { pxw: number; pxh: number },
  wave: number
) => {
  const wobble = makeIntWobbler(clamp(wave * 6, 1, 10))
  const final = finalPixelSize(clamp((1 + wave) / 10, 0.2, 0.3))

  const drawCell = (x: number, y: number) => {
    const posX = wobble(x) * pxw
    const posY = wobble(y) * pxh
    p.ellipse(posX, posY, ...final(pxw, pxh))
  }

  brighnessSnapshot.forEach(([x, y, bri]) => {
    if (bri > 110 - wave * 20) {
      pushPop(() => {
        p.fill(bri - 50, bri)
        drawCell(x, y)
      })
    }
  })
}

export const calcWave = (analyzer: Analyzer) => {
  const base = analyzer.analyze().reduce((a, b) => a + b) / analyzer.bufferLength
  return clamp((base - 0.3) * 10, 0, 2)
}
