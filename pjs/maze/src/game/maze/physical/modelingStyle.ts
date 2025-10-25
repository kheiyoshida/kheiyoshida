import { RenderingStyle } from '../../stage/style.ts'
import { maze } from '../../index.ts'

export const getModelingStyle = (): ModelingStyle => {
  const style = maze.getStageContext().current.style
  return determineModelingStyle(style)
}

export const determineModelingStyle = (style: RenderingStyle): ModelingStyle => {
  if (style <= 3) return 'poles'
  if (style >= 7) return 'tiles'
  return 'classic'
}

export type ModelingStyle = 'classic' | 'poles' | 'tiles'
