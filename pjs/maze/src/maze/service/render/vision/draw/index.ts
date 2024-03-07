import { ListenableState } from '../../../../domain/vision'
import { allInOneDrawer } from './drawers'
import { getDrawParams } from '../../../../domain/vision/drawParams'
import { GridDrawer } from './types'

type DrawProvider = (state: ListenableState) => GridDrawer

export const normalDraw: DrawProvider = (state: ListenableState) => {
  const params = getDrawParams(state)
  return allInOneDrawer(params)
}
