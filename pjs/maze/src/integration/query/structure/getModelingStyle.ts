import { game } from '../../../game'
import { determineModelingStyle, Structure } from '../../../game/world'

export const getModelingStyle = (): Structure => {
  const style = game.maze.stageContext.current.style
  return determineModelingStyle(style)
}
