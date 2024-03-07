import { ListenableState } from '..'
import { allInOneDrawer } from './drawers'
import { getParams } from './parameters'
import { GridDrawer } from './types'

type DrawProvider = (state: ListenableState) => GridDrawer

export const normalDraw: DrawProvider = (state: ListenableState) => {
  const params = getParams(state)
  return allInOneDrawer(params)
}
