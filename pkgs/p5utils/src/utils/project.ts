import p5 from 'p5'

export const instruction = (text = 'click/tap to play') => {
  const div = p.createDiv(text)
  div.style('position', 'fixed')
  div.style('top', '50vh')
  div.style('left', '45vw')
  div.style('color', 'white')
  div.style('z-index', '100')
  return div
}

export type SketchConfigStore = {
  /**
   * canvas width
   */
  cw: number
  /**
   * canvas height
   */
  ch: number

  /**
   * flag for webgl mode
   */
  webgl?: boolean

  fillColor: p5.Color
  strokeColor: p5.Color
  strokeWeight: number
  frameRate: number
}

export const applyConfig = ({
  cw,
  ch,
  fillColor,
  strokeColor,
  strokeWeight,
  frameRate,
  webgl,
}: SketchConfigStore) => {
  p.createCanvas(cw, ch, webgl ? p.WEBGL : p.P2D)
  p.background(fillColor)
  p.fill(fillColor)
  p.stroke(strokeColor)
  p.strokeWeight(strokeWeight)
  p.frameRate(frameRate)
}
