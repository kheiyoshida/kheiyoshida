import { store } from '../../../store'

export const getMapInfoFromCurrentState = () => ({
  grid: store.current.grid,
  current: store.current.current,
  direction: store.current.direction,
  floor: store.current.floor,
})

export type MapInfo = ReturnType<typeof getMapInfoFromCurrentState>
