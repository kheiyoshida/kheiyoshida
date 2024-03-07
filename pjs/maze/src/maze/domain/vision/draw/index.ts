import { ListenableState } from '..'
import { allInOneDrawer } from './drawers'
import { getDrawParams } from './parameters'
import { GridDrawer } from './types'

type DrawProvider = (state: ListenableState) => GridDrawer

export const normalDraw: DrawProvider = (state: ListenableState) => {
  const params = getDrawParams(state)
  return allInOneDrawer(params)
}
