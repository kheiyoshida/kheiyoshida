import p5 from 'p5'
import { LazyInit, ReducerMap, makeStoreV2 } from 'utils'
import { InitialNumOfTrees, TreeRange } from '../constants'
import { generateTrees } from '../services/objects'

type ObjectState = {
  trees: p5.Geometry[]
}

const init: LazyInit<ObjectState> = () => {
  return {
    trees: generateTrees(TreeRange, InitialNumOfTrees),
  }
}

const reducers = {
  renewTrees: (s) => (roomVar: number) => {
    s.trees = generateTrees(TreeRange, roomVar, roomVar)
  },
} satisfies ReducerMap<ObjectState>

export const makeObjectStore = () => makeStoreV2<ObjectState>(init)(reducers)
