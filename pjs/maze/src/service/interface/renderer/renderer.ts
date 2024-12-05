import {
  CircleSpec,
  LineShapeSpec,
  RectSpec,
  ShapeSpec,
  SquareSpec,
  TextSpec,
  TriangleSpec,
  UIRenderer,
} from './types.ts'
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
  const lock = makeLock()

  const clearCanvas = (id?: string) => {
    if (!lock.validate(id)) return;
    ctx.clearRect(0, 0, logicalWidth, logicalHeight)
  }

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

  const draw = <S extends ShapeSpec>(cb: (s: S) => void) => {
    return (spec: S) => {
      if(!lock.validate(spec.id)) return;

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
      if (spec.lineWidth) {
        ctx.lineWidth = spec.lineWidth
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
      if (spec.lineWidth) {
        ctx.lineWidth = 1.0
      }
    }
  }

  const drawRect = draw((spec: RectSpec) => {
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

  const drawTriangle = draw((spec: TriangleSpec) => {
    withContext(() => {

      ctx.translate(spec.position.x, spec.position.y)
      ctx.rotate(spec.rotation)
      ctx.beginPath()
      ctx.moveTo(spec.points[0].x, spec.points[0].y)
      ctx.lineTo(spec.points[1].x, spec.points[1].y)
      ctx.lineTo(spec.points[2].x, spec.points[2].y)
      if (!spec.omitStroke) {
        ctx.stroke()
      }
      if (!spec.omitFill) {
        ctx.fill()
      }
    })
  })

  const drawCircle = draw((spec: CircleSpec) => {
    ctx.beginPath()
    ctx.arc(...roundArgs(spec.centerX, spec.centerY, spec.size), 0, 2 * Math.PI)
    if (!spec.omitStroke) {
      ctx.stroke()
    }
    if (!spec.omitFill) {
      ctx.fill()
    }
  })

  const drawLineShape = draw((spec: LineShapeSpec) => {
    ctx.beginPath()
    ctx.moveTo(spec.points[0].x, spec.points[0].y)
    for(let i = 1; i < spec.points.length; i++) {
      ctx.lineTo(spec.points[i].x, spec.points[i].y)
    }
    if (!spec.omitStroke) {
      ctx.stroke()
    }
    if (!spec.omitFill) {
      ctx.fill()
    }
  })

  const drawText = draw((spec: TextSpec) => {
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
    drawLineShape,
    clearCanvas,
    get context() {
      return ctx
    },
    lock(id: string) {
      lock.acquire(id)
    },
    unlock(id: string) {
      lock.unlock(id)
    }
  }
}

const makeLock = () => {
  let currentAdminId: string|null = null; 
  return {
    acquire(id: string) {
      if (currentAdminId) return;
      currentAdminId = id
    },
    validate(id?: string) {
      if (!currentAdminId) return true;
      return currentAdminId === id
    },
    unlock (id: string) {
      if (currentAdminId !== id) return;
      currentAdminId = null
    }
  }
}
