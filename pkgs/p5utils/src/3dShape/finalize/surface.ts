import { Position3D } from "../../camera/types"
import { ShapeVertex } from "../types"

export const finalizeSurface = (surface: ShapeVertex[]) => {
  p.beginShape()
  surface.forEach((vertex) => {
    p.vertex(...vertex.array() as Position3D)
  })
  p.endShape()  
}