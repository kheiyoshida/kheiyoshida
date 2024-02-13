import { Position3D } from "../3d/types"
import { VectorAngles } from "../3d/types"

export type Camera = {
  setPosition: (x: number, y: number, z: number) => void
  position: Position3D
  setAbsoluteDirection: (angles: VectorAngles) => void
  setRelativeDirection: (angles: VectorAngles) => void
  setSpeed: (speed: number) => void
  move: () => void
  setFocus: (position?: Position3D) => void
  focus: Position3D | undefined
  turn: (angles: VectorAngles)  => void
  cameraCenter: Position3D
  forwardDir: VectorAngles
  turnWithFocus: (angles: VectorAngles, focus: Position3D) => void
}

export type CameraNode = {
  position: Position3D
  setPosition: (x: number, y: number, z: number) => void
  setDirection: (angles: VectorAngles) => void
  setSpeed: (speed: number) => void
  move: () => void  
}
