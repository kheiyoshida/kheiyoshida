import { BaseNode } from '../node/types'

export type GraphNode<ExtraFields = {}> = BaseNode &
  ExtraFields & {
    /**
     * uni directional edges
     */
    edges: GraphNode<ExtraFields>[]
  }

export type NodeGraph<NodeType = GraphNode> = NodeType[]
