import { RenderingStyle } from '../../stage/style.ts'
import { game } from '../../index.ts'

export const getModelingStyle = (): ModelingStyle => {
  const style = game.maze.stageContext.current.style
  return determineModelingStyle(style)
}

export const determineModelingStyle = (style: RenderingStyle): ModelingStyle => {
  if (style <= 3) return 'poles'
  if (style >= 7) return 'tiles'
  return 'classic'
}

export type ModelingStyle = 'classic' | 'poles' | 'tiles'
