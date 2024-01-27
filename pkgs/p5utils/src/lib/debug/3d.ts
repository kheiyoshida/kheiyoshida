import { drawLineBetweenVectors } from "../render/drawers/draw"

export function draw3dGrid() {
  drawLineBetweenVectors(p.createVector(-500, 0, 0), p.createVector(500, 0,0))
  drawLineBetweenVectors(p.createVector(0, 500, 0), p.createVector(0, -500,0))
  drawLineBetweenVectors(p.createVector(0, 0, 500), p.createVector(0, 0, -500))
}
