import { LazyInit, ReducerMap, makeIntWobbler, makeStoreV2, randomIntInclusiveBetween } from 'utils'
import { TreeNode, createGraphNode } from '../primitives/node'
import { Config } from '../config'

export type TreeGraph = TreeNode[]

export type GraphState = {
  graph: TreeGraph
  maxNodes: number
}

export const init: LazyInit<GraphState> = () => {
  const initialNode = createGraphNode([0, 1000, 0])
  return {
    graph: [initialNode],
    maxNodes: Config.InitialMaxNodes
  }
}

export const reducers = {
  grow:
    (s) =>
    (numEdges: number, thetaDelta: number, growAmount: number, randomAbort?: () => boolean) => {
      if (s.graph.length >= s.maxNodes) return
      s.graph
        .filter((node) => !node.hasGrown)
        .forEach((node) => {
          if (randomAbort && randomAbort()) return
          const newNodes = node.emitEdges(numEdges, thetaDelta, growAmount, (delta, amount) => [
            {
              theta: makeIntWobbler(20)(delta.theta),
              phi: makeIntWobbler((10 - numEdges) * 20)(delta.phi),
            },
            amount + randomIntInclusiveBetween(-10, 40)
          ])
          s.graph.push(...newNodes)
          node.hasGrown = true
        })
    },
} satisfies ReducerMap<GraphState>

export const makeGraphStore = () => makeStoreV2<GraphState>(init)(reducers)
