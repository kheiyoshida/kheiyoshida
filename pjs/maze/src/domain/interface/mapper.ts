import { Position } from 'utils'
import { store } from '../../store'

export const resetMap = () => {
  store.resetMap()
}

export const track = ({ from, dest }: { from: number[]; dest: number[] }) => {
  store.trackMap(from as Position, dest as Position)
}

export const getMapInfoFromCurrentState = () => ({
  grid: store.current.grid,
  current: store.current.current,
  direction: store.current.direction,
  floor: store.current.floor,
})

export type MapInfo = ReturnType<typeof getMapInfoFromCurrentState>
