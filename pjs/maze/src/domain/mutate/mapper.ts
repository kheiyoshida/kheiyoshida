import { Position } from 'utils'
import { store } from '../../store'

export const resetMap = () => {
  store.resetMap()
}

export const track = ({ from, dest }: { from: number[]; dest: number[] }) => {
  store.trackMap(from as Position, dest as Position)
}

