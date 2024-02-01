import { LazyInit, ReducerMap, makeStoreV2 } from 'utils'
import { TreeNode, createGraphNode } from '../primitives/node'

export type TreeGraph = TreeNode[]

export type GraphState = {
  graph: TreeGraph
}

export const init: LazyInit<GraphState> = () => {
  const initialNode = createGraphNode([0, -1000, 0])
  return {
    graph: [initialNode],
  }
}

export const reducers = {
  grow: s => (numEdges: number, thetaDelta: number, growAmount: number) => {
    s.graph.filter(node => !node.hasGrown).forEach(node => {
      const newNodes = node.emitEdges(numEdges, thetaDelta, growAmount)
      s.graph.push(...newNodes)
      node.hasGrown = true
    })
  }
} satisfies ReducerMap<GraphState>

export const makeGraphStore = () => makeStoreV2<GraphState>(init)(reducers)
