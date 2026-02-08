import { Atmosphere } from '../game/world/types.ts'
import { IWorldState } from '../game/world/state.ts'

export const debugAtmosphere: Atmosphere | undefined = undefined

export const enableDebugState = true
export const debugState: IWorldState[] = [
  { density: 0.6, gravity: 0.0, order: 1.0, scale: 0.7 },
  { density: 0.6, gravity: 0.0, order: 1.0, scale: 0.7 },
  { density: 0.6, gravity: 0.0, order: 1.0, scale: 0.7 },
]
