import p5 from 'p5'
import { distanceBetweenPositions, getEvenlyMappedSphericalAngles } from 'p5utils/src/3d'
import {
  LazyInit,
  ReducerMap,
  fireByRate,
  makeIntWobbler,
  makeStoreV2,
  randomIntInclusiveBetween,
} from 'utils'
import { Config } from '../config'
import { createEdgeGeometry, createNodeGeometry } from '../primitives/edgeGeometry'
import { EmitNodeEdgeRandomizer, TreeNode, createGraphNode } from '../primitives/node'

export type TreeGraph = TreeNode[]

export type GraphState = {
  graph: TreeGraph
  growOptions: GrowOptions
  edgeGeometries: (p5.Geometry[] | null)[]
}

export type GrowOptions = {
  numOfGrowEdges: number
  thetaDelta: number
  growAmount: number
  randomAbortRate: number
}

export const init: LazyInit<GraphState> = () => {
  const initialNode = createGraphNode(
    [0, 0, 0],
    { theta: 0, phi: 0 },
    Config.DefaultMoveAmount,
    Config.DefaultMovableDistance,
    (s) => (s > Config.DecreaseSpeed ? s - Config.DecreaseSpeed : Config.DecreaseSpeed),
    (a) => ({ theta: a.theta + 1, phi: a.phi + 10 })
  )
  return {
    graph: [initialNode],
    growOptions: {
      numOfGrowEdges: 10,
      thetaDelta: 10,
      growAmount: 1000,
      randomAbortRate: 0,
    },
    edgeGeometries: [],
  }
}

export const reducers = {
  setGrowOptions: (s) => (growOptions: Partial<GrowOptions>) => {
    s.growOptions = { ...s.growOptions, ...growOptions }
  },
  initialGrow: (s) => () => {
    const directions = getEvenlyMappedSphericalAngles(Config.InitialGrowDimensions, [45, 135])
    directions.forEach((direction) => {
      const initialNode = s.graph[0]
      initialNode.growDirection = direction
      const newNodes = growNode(initialNode, s.growOptions)
      s.graph.push(...newNodes)
    })
  },
  grow: (s) => () => {
    if (s.graph.length >= Config.InitialMaxNodes) return
    s.graph
      .filter((node, i) => !node.hasGrown || i !== 0)
      .forEach((node) => {
        const newNodes = growNode(node, s.growOptions)
        s.graph.push(...newNodes)
        node.hasGrown = true
      })
  },
  calculateGeometries: (s) => () => {
    s.graph.forEach((node, i) => {
      if (s.edgeGeometries[i]) return
      s.edgeGeometries.push(null) // fill
      if (node.edges.length) {
        s.edgeGeometries[i] = calcNodeEdgeGeometries(node)
      }
    })
  },
} satisfies ReducerMap<GraphState>

const BaseGrowAmount = 500
const growNode = (node: TreeNode, options: GrowOptions) => {
  const { numOfGrowEdges, thetaDelta, growAmount, randomAbortRate } = options
  if (fireByRate(randomAbortRate)) return []
  const finalGrowAmount = BaseGrowAmount + node.growIndex * growAmount
  const newNodes = node.emitEdges(
    numOfGrowEdges,
    thetaDelta,
    finalGrowAmount,
    makeRandomizer(numOfGrowEdges)
  )
  return newNodes
}

const makeRandomizer =
  (numOfGrowEdges: number): EmitNodeEdgeRandomizer =>
  (delta, amount) => [
    {
      theta: makeIntWobbler(20)(delta.theta),
      phi: makeIntWobbler((10 - numOfGrowEdges) * 20)(delta.phi),
    },
    amount + randomIntInclusiveBetween(-10, 100),
  ]

const calcNodeEdgeGeometries = (node: TreeNode): p5.Geometry[] => {
  return node.edges.map((edge) => {
    if (node.growIndex === 0) return createNodeGeometry(1, 4) // don't index.ts
    const dist = distanceBetweenPositions(node.position, edge.position)
    const geo = createEdgeGeometry(dist, 500 / Math.pow(node.growIndex, 1.8))
    return geo
  })
}

export const makeGraphStore = () => makeStoreV2<GraphState>(init)(reducers)
