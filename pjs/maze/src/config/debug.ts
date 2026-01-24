import { Atmosphere } from '../game/world/types.ts'
import { IWorldState } from '../game/world/state.ts'

export const debugAtmosphere: Atmosphere | undefined = undefined

export const enableDebugState = false
export const debugState: IWorldState[] = [
  { density: 1.0, gravity: 1.0, order: 0.3, scale: 0.9 },
  { density: 1.0, gravity: 1.0, order: 0.3, scale: 0.9 },
  { density: 1.0, gravity: 1.0, order: 0.3, scale: 0.9 },
]
