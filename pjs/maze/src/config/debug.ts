import { Atmosphere } from '../game/world/types.ts'
import { IWorldState } from '../game/world/state.ts'

export const debugAtmosphere: Atmosphere | undefined = undefined

export const enableDebugState = false
export const debugState: IWorldState[] = [
  { density: 0.3, gravity: 1.0, order: 1.0, scale: 0.9 },
  { density: 0.4, gravity: 1.0, order: 1.0, scale: 0.9 },
  { density: 0.5, gravity: 1.0, order: 1.0, scale: 0.9 },
]
