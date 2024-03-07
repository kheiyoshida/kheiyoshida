import { ListenableState } from '..'
import { floorToThreshold } from '../../stats'
import { parameterizeNormalScene } from './default'
import { parameterizeEffectScene } from './effect'
import { ColorIntention, Scene } from './types'

export const domainColorLogic = (state: ListenableState): ColorIntention<Scene> => {
  const [mid, low] = floorToThreshold(state.floor)
  if (state.sanity >= mid) return [Scene.Normal, parameterizeNormalScene(state)]
  else if (state.sanity >= low) return [Scene.Effect, parameterizeEffectScene(state)]
  else return [Scene.Effect, parameterizeEffectScene(state)]
}
