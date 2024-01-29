import { BaseNode3D } from "p5utils/src/data/node/types"

export type CameraNode = BaseNode3D & {
  move: () => void
}

export interface CameraInterface {
  node: CameraNode
  updateDirection(): void
  move(): void
}
