import { logicalHeight, logicalWidth, wh, ww } from '../../../config'

const getUICanvas = (): HTMLCanvasElement => {
  const canvas = document.getElementById('ui-canvas') as HTMLCanvasElement
  if (!canvas) throw Error(`could not find ui canvas`)
  return canvas
}

export const getUICanvasContext = (): CanvasRenderingContext2D => {
  const canvas = getUICanvas()
  const ctx = canvas.getContext('2d')
  if (!ctx) throw Error(`ctx is null`)
  resizeCanvas(ctx)
  return ctx
}

const resizeCanvas = (ctx: CanvasRenderingContext2D) => {
  const canvas = ctx.canvas;
  canvas.setAttribute('width', logicalWidth.toString())
  canvas.setAttribute('height', logicalHeight.toString())
  canvas.setAttribute(
    'style',
    `width: ${ww.toString()}px; height: ${wh.toString()}px;`
  )
}
