import { RenderingStyle } from '../../stage/style.ts'

export const determineModelingStyle = (style: RenderingStyle): ModelingStyle => {
  if (style <= 3) return 'poles'
  if (style >= 7) return 'tiles'
  return 'classic'
}

export type ModelingStyle = 'classic' | 'poles' | 'tiles'
