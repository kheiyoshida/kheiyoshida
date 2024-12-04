import { HSL } from 'maze-gl'

export type UIRenderer = {
  changeFillColor(hsl: HSL): void
  changeStrokeColor(hsl: HSL): void

  drawRect(spec: RectSpec): void
  drawSquare(spec: SquareSpec): void
  drawTriangle(spec: TriangleSpec): void
  drawCircle(spec: CircleSpec): void

  drawText(spec: TextSpec): void

  clearCanvas(): void

  context: CanvasRenderingContext2D
}

export type ShapeSpec = {
  temporaryFillColor?: HSL
  temporaryStrokeColor?: HSL
  omitStroke?: true
  omitFill?: true
  alpha?: number
}

export type RectSpec = ShapeSpec & {
  centerX: number,
  centerY: number,
  width: number,
  height: number
}

export type SquareSpec = ShapeSpec & {
  centerX: number,
  centerY: number,
  size: number,
}

export type PointSpec = ShapeSpec & {
  x: number,
  y: number,
}

export type TriangleSpec = ShapeSpec & {
  position: PointSpec,
  points: [PointSpec, PointSpec, PointSpec],
  /**
   * in radians
   */
  rotation: number
}

export type CircleSpec = ShapeSpec & {
  centerX: number,
  centerY: number,
  size: number,
}

export type TextSpec = ShapeSpec & {
  positionX: number,
  positionY: number,
  text: string,
  fontSize: number,
}
