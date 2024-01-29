import { BaseNode } from '../node/types'

export type GraphNode<ExtraFields = Record<string, unknown>> = BaseNode &
  ExtraFields & {
    /**
     * uni directional edges
     */
    edges: GraphNode<ExtraFields>[]
  }

export type NodeGraph<NodeType = GraphNode> = NodeType[]
