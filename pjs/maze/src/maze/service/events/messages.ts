import { VisionIntention } from "../../domain/vision";

export enum RenderSignal {
  CurrentView = 'CurrentView',
  Go = 'Go',
  TurnRight = 'TurnRight',
  TurnLeft = 'TurnLeft',
  GoDownStairs = 'GoDownStairs',
  ProceedToNextFloor = 'ProceedToNextFloor',
  OpenMap = 'OpenMap',
  CloseMap = 'CloseMap',
}

export type RenderMessage = [
  signal: RenderSignal,
  slice: VisionIntention
]

export const MessageQueue: RenderMessage[] = []
