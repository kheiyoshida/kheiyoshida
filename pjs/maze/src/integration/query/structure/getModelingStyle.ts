import { game } from '../../../game'
import { determineModelingStyle, ModelingStyle } from '../../../game/maze/physical/modelingStyle.ts'

export const getModelingStyle = (): ModelingStyle => {
  const style = game.maze.stageContext.current.style
  return determineModelingStyle(style)
}
