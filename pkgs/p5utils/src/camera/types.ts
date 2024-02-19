import { Position3D } from "../3d/types"
import { SphericalAngles } from "../3d/types"

export type Camera = {
  setPosition: (x: number, y: number, z: number) => void
  position: Position3D
  setAbsoluteDirection: (angles: SphericalAngles) => void
  setRelativeDirection: (angles: SphericalAngles) => void
  setSpeed: (speed: number) => void
  move: () => void
  setFocus: (position?: Position3D) => void
  focus: Position3D | undefined
  turn: (angles: SphericalAngles)  => void
  cameraCenter: Position3D
  forwardDir: SphericalAngles
  turnWithFocus: (angles: SphericalAngles, focus: Position3D) => void
}

export type CameraNode = {
  position: Position3D
  setPosition: (x: number, y: number, z: number) => void
  setDirection: (angles: SphericalAngles) => void
  setSpeed: (speed: number) => void
  move: () => void  
}
