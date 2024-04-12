import { statusStore, store } from '../../store'
import { floorToThreshold } from '../stats'
import { parameterizeNormalScene } from './default'
import { parameterizeEffectScene } from './effect'
import { ColorIntention } from './types'

export const domainColorLogic = (): ColorIntention => {
  const state = { floor: store.current.floor, ...statusStore.current }
  const [mid, low] = floorToThreshold(state.floor)
  if (state.sanity >= mid) return parameterizeNormalScene(state)
  else if (state.sanity >= low) return parameterizeEffectScene(state)
  else return parameterizeEffectScene(state)
}
