import { VectorAngles } from "../3d/types"

export type Position3D = [x: number, y: number, z: number]

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
}

export type CameraNode = {
  position: Position3D
  setPosition: (x: number, y: number, z: number) => void
  setDirection: (angles: VectorAngles) => void
  setSpeed: (speed: number) => void
  move: () => void  
}
