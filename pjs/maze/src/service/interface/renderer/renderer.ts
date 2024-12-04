import { CircleSpec, RectSpec, ShapeSpec, SquareSpec, TextSpec, TriangleSpec, UIRenderer } from './types.ts'
import { getUICanvasContext } from './context.ts'
import { HSL } from 'maze-gl'
import { logicalHeight, logicalWidth } from '../../../config'
import { roundArgs } from './utils.ts'

let renderer: UIRenderer

export const getUIRenderer = (): UIRenderer => {
  if (!renderer) renderer = makeUIRenderer()
  return renderer
}

const makeUIRenderer = (): UIRenderer => {
  const ctx = getUICanvasContext()
  const clearCanvas = () => ctx.clearRect(0, 0, logicalWidth, logicalHeight)

  let fillColor: HSL = [0, 0.0, 1.0]
  let strokeColor: HSL = [0, 0, 0.0]

  const convertHSL = ([h, s, l]: HSL): string => `hsl(${h} ${s * 100} ${l * 100})`
  const applyFillColor = (hsl: HSL) => {
    ctx.fillStyle = convertHSL(hsl)
  }
  const applyStrokeColor = (hsl: HSL) => {
    ctx.strokeStyle = convertHSL(hsl)
  }

  // init colors
  applyFillColor(fillColor)
  applyStrokeColor(strokeColor)

  const drawWithColor = <S extends ShapeSpec>(cb: (s: S) => void) => {
    return (spec: S) => {
      // apply temporary colors
      if (spec.temporaryFillColor) {
        applyFillColor(spec.temporaryFillColor)
      }
      if (spec.temporaryStrokeColor) {
        applyStrokeColor(spec.temporaryStrokeColor)
      }
      if (spec.alpha) {
        ctx.globalAlpha = spec.alpha
      }

      // exec callback
      cb(spec)

      // rollback colors
      if (spec.temporaryFillColor) {
        applyFillColor(fillColor)
      }
      if (spec.temporaryStrokeColor) {
        applyFillColor(strokeColor)
      }
      if (spec.alpha) {
        ctx.globalAlpha = 1.0
      }
    }
  }

  const drawRect = drawWithColor((spec: RectSpec) => {
    if (!spec.omitFill) {
      ctx.fillRect(
        // spec.centerX - spec.width / 2, spec.centerY - spec.height / 2, spec.width, spec.height
        ...roundArgs(spec.centerX - spec.width / 2, spec.centerY - spec.height / 2, spec.width, spec.height)
      )
    }
    if (!spec.omitStroke) {
      ctx.strokeRect(
        ...roundArgs(spec.centerX - spec.width / 2, spec.centerY - spec.height / 2, spec.width, spec.height)
      )
    }
  })

  const drawSquare = (spec: SquareSpec) => {
    drawRect({
      ...spec,
      height: spec.size,
      width: spec.size,
    })
  }

  const withContext = (cb: () => void) => {
    cb()
    ctx.setTransform(1, 0, 0, 1, 0, 0)
  }

  const drawTriangle = drawWithColor((spec: TriangleSpec) => {
    withContext(() => {
      ctx.translate(spec.position.x, spec.position.y)
      ctx.rotate(spec.rotation)
      ctx.beginPath()
      ctx.moveTo(spec.points[0].x, spec.points[0].y)
      ctx.lineTo(spec.points[1].x, spec.points[1].y)
      ctx.lineTo(spec.points[2].x, spec.points[2].y)
      ctx.fill()
    })
  })

  const drawCircle = drawWithColor((spec: CircleSpec) => {
    ctx.beginPath()
    ctx.arc(...roundArgs(spec.centerX, spec.centerY, spec.size), 0, 2 * Math.PI)
    ctx.fill()
    ctx.stroke()
  })

  const drawText = drawWithColor((spec: TextSpec) => {
    ctx.font = `${spec.fontSize}px sans-serif`
    ctx.fillText(spec.text, ...roundArgs(spec.positionX, spec.positionY))
  })

  return {
    changeFillColor(hsl: HSL) {
      fillColor = hsl
      applyFillColor(fillColor)
    },
    changeStrokeColor(hsl: HSL) {
      strokeColor = hsl
      applyStrokeColor(hsl)
    },
    drawRect,
    drawSquare,
    drawTriangle,
    drawCircle,
    drawText,
    clearCanvas,
    get context() {
      return ctx
    },
  }
}
