import { ListenableState } from '..'
import { allInOneDrawer, blurredDrawer, plainDrawer } from './drawers'
import { getParams } from './parameters'
import { GridDrawer } from './types'

type DrawProvider = (state: ListenableState) => GridDrawer

export const normalDraw: DrawProvider = (state: ListenableState) => {
  return allInOneDrawer(getParams(state))
  // const params = getParams(state)
  // return blurredDrawer(
  //   params.visibility,
  //   params.fog,
  //   params.blurRate
  // )
}
