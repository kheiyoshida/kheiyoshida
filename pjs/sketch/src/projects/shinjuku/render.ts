import { iterateMatrix } from 'p5utils/src/lib/data/matrix/matrix'
import { RGBAMatrix } from 'p5utils/src/lib/data/matrix/types'
import { Analyzer } from 'p5utils/src/lib/media/audio/types'
import { brightness } from 'p5utils/src/lib/media/pixel/analyze'
import { pushPop } from 'p5utils/src/lib/utils/p5utils'
import { makeIntWobbler, makePingpongNumberStore } from 'utils'

const wobble = makeIntWobbler(10)

const finalPixelSize =
  (rate: number) =>
  (pxw: number, pxh: number): [number, number] => [pxw * rate, pxh * rate]



export const drawMatrix = (
  videoSnapshot: RGBAMatrix,
  { pxw, pxh }: { pxw: number; pxh: number },
  analyzer: Analyzer
) => {
  // const waveformData = analyzer.analyze()

  const drawCell = (x: number, y: number) => {
    // const index = x % analyzer.bufferLength
    // const wave = waveformData[index] * 0.5
    p.rect(wobble(x) * pxw, wobble(y) * pxh, ...finalPixelSize(0.2)(pxw, pxh))
  }

  iterateMatrix(videoSnapshot, (x, y, rgba) => {
    const bri = brightness(rgba)
    if (bri > 120) {
      pushPop(() => {
        p.fill(255, bri)
        drawCell(x, y)
      })
    }
  })
}
