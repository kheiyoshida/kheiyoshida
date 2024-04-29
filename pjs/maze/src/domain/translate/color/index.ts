import { statusStore, store } from '../../../store'
import { parameterizeNormalScene } from './default'
import { parameterizeEffectScene } from './effect'
import { ColorOperationParams } from './types'

export const domainColorLogic = (): ColorOperationParams => {
  return ['default']
  const state = { floor: store.current.floor, ...statusStore.current }
  const [mid, low] = floorToThreshold(state.floor)
  if (state.sanity >= mid) return parameterizeNormalScene(state)
  else if (state.sanity >= low) return parameterizeEffectScene(state)
  else return parameterizeEffectScene(state)
}

const floorToThreshold = (floor: number): [number, number] => {
  if (floor < 8) return [70, 30]
  if (floor < 16) return [80, 40]
  return [90, 50]
}
