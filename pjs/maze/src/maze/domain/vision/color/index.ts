import { ListenableState } from '..'
import { floorToThreshold } from '../../stats'
import { applyPalette, getPalette, setPalette } from './palette'
import { Scene } from './scenes'
import { normal } from './scenes/default'
import { effect } from './scenes/effect'

/**
 * function to apply colors based on the current state
 */
export type ApplyColors = () => void

/**
 * apply scene's color
 */
const apply =
  (scene: Scene, state: ListenableState): ApplyColors =>
  () => {
    const newPalette = scene(getPalette(), state)
    setPalette(newPalette)
    applyPalette(newPalette)
  }

export type ScneProvider = (state: ListenableState) => ApplyColors

export const normalSceneProvider: ScneProvider = (state: ListenableState) => {
  const [mid, low] = floorToThreshold(state.floor)
  if (state.sanity >= mid) return apply(normal, state)
  else if (state.sanity >= low) return apply(effect, state)
  else return apply(effect, state)
}
