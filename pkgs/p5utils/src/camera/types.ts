import { VectorAngles } from "../data/node/types"

export type Position3D = [number, number, number]

export type Camera = {
  setPosition: (x: number, y: number, z: number) => void
  position: Position3D
  setDirection: (angles: VectorAngles) => void
  setSpeed: (speed: number) => void
  move: () => void
}

export type CameraNode = {
  position: Position3D
  setPosition: (x: number, y: number, z: number) => void
  setDirection: (angles: VectorAngles) => void
  setSpeed: (speed: number) => void
  move: () => void  
}
