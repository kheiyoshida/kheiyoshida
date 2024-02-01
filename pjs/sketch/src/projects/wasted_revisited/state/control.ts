import { makeStoreV2 } from "utils"

export type Direction = 'go' | 'back' | 'right' | 'left' | null

type ControlState = {
  direction: Direction
}

export const controlStore = makeStoreV2<ControlState>({
  direction: null
})({
  updateDir: s => (dir: Direction) => {
    s.direction = dir
  }
})
