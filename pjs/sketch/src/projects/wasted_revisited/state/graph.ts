import {
  LazyInit,
  ReducerMap,
  fireByRate,
  loop,
  makeIntWobbler,
  makeStoreV2,
  randomIntInclusiveBetween,
} from 'utils'
import { EmitNodeEdgeRandomizer, TreeNode, createGraphNode } from '../primitives/node'
import { Config } from '../config'
import p5 from 'p5'
import { distanceBetweenPositions } from 'p5utils/src/3d'
import { createEdgeGeometry } from '../primitives/edgeGeometry'

export type TreeGraph = TreeNode[]

export type GraphState = {
  graph: TreeGraph
  maxNodes: number
  growOptions: GrowOptions
  geometries: (p5.Geometry[] | null)[]
}

export type GrowOptions = {
  numOfGrowEdges: number
  thetaDelta: number
  growAmount: number
  randomAbortRate: number
}

export const init: LazyInit<GraphState> = () => {
  const initialNode = createGraphNode(
    [0, 1000, 0],
    { theta: 0, phi: 0 },
    Config.DefaultMoveAmount,
    Config.DefaultMovableDistance,
    (s) => (s > Config.DecreaseSpeed ? s - Config.DecreaseSpeed : Config.DecreaseSpeed),
    (a) => ({ theta: a.theta + 1, phi: a.phi + 10 })
  )
  return {
    graph: [initialNode],
    maxNodes: Config.InitialMaxNodes,
    growOptions: {
      numOfGrowEdges: 10,
      thetaDelta: 10,
      growAmount: 1000,
      randomAbortRate: 0,
    },
    geometries: [],
  }
}

export const reducers = {
  setGrowOptions: (s) => (growOptions: Partial<GrowOptions>) => {
    s.growOptions = { ...s.growOptions, ...growOptions }
  },
  grow: (s) => () => {
    if (s.graph.length >= s.maxNodes) return
    const { numOfGrowEdges, thetaDelta, growAmount, randomAbortRate } = s.growOptions
    s.graph
      .filter((node) => !node.hasGrown)
      .forEach((node) => {
        if (fireByRate(randomAbortRate)) return
        const randomizer: EmitNodeEdgeRandomizer = (delta, amount) => [
          {
            theta: makeIntWobbler(20)(delta.theta),
            phi: makeIntWobbler((10 - numOfGrowEdges) * 20)(delta.phi),
          },
          amount + randomIntInclusiveBetween(-10, 100),
        ]
        const newNodes = node.emitEdges(numOfGrowEdges, thetaDelta, growAmount, randomizer)
        s.graph.push(...newNodes)
        node.hasGrown = true
      })
  },
  calculateGeometries: (s) => () => {
    loop(s.graph.length, (i) => {
      if (s.geometries[i]) return
      const node = s.graph[i]
      s.geometries.push(null) // fill
      if (node.edges.length === 0) return
      const edgeGeometries: p5.Geometry[] = node.edges.map((edge) => {
        const dist = distanceBetweenPositions(node.position, edge.position)
        const geo = createEdgeGeometry(dist)
        return geo
      })
      s.geometries[i] = edgeGeometries
    })
  },
} satisfies ReducerMap<GraphState>

export const makeGraphStore = () => makeStoreV2<GraphState>(init)(reducers)
