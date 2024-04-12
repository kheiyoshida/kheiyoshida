import { ListenableState } from '../../../domain'
import { ColorIntention } from '../../../domain/color/types'
import { effectSceneManipMap } from './manipMaps'
import { applyPalette, getPalette, setPalette } from './palette'

// interface ColorManager {
//   resolve: (intention: ColorIntention) => void
//   setFixedOperation: (operation: 'fade', ttl: number) => void
// }

// export const createColorManager = (): ColorManager => {
//   let operation
//   return {
//     resolve([scene, params]) {},
//   }
// }

export type ApplyColors = () => void
export type ScneProvider = (state: ListenableState) => ApplyColors

export const resolveColorIntention = (params: ColorIntention) => {
  const palette = getPalette()
  const map = effectSceneManipMap
  const pattern = params[0]
  const newPalette = map[pattern](palette, params)
  setPalette(newPalette)
  applyPalette(newPalette)
}

