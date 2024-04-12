import { statusStore, store } from '../../store'
import { floorToThreshold } from '../stats'
import { parameterizeNormalScene } from './default'
import { parameterizeEffectScene } from './effect'
import { ColorIntention, Scene } from './types'

export const domainColorLogic = (): ColorIntention<Scene> => {
  const state = { floor: store.current.floor, ...statusStore.current }
  const [mid, low] = floorToThreshold(state.floor)
  if (state.sanity >= mid) return [Scene.Normal, parameterizeNormalScene(state)]
  else if (state.sanity >= low) return [Scene.Effect, parameterizeEffectScene(state)]
  else return [Scene.Effect, parameterizeEffectScene(state)]
}
