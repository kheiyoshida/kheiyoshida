import { HSL } from 'maze-gl'


export type UIRenderer = {
  changeFillColor(hsl: HSL): void
  changeStrokeColor(hsl: HSL): void

  drawRect(spec: RectSpec): void
  drawSquare(spec: SquareSpec): void
  drawTriangle(spec: TriangleSpec): void
  drawCircle(spec: CircleSpec): void
  drawLineShape(spec: LineShapeSpec): void

  drawText(spec: TextSpec): void

  clearCanvas(id?: string): void

  context: CanvasRenderingContext2D

  /**
   * prevent renderer from drawing other shapes
   * @id
   */
  lock(id: string): void
  unlock(id: string): void
}

export type ShapeSpec = {
  temporaryFillColor?: HSL
  temporaryStrokeColor?: HSL
  omitStroke?: true
  omitFill?: true
  alpha?: number
  lineWidth?: number
  id?: string
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

export type LineShapeSpec = ShapeSpec & {
  points: PointSpec[],
}
