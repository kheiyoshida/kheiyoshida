import p5 from "p5"
import { GraphNode, NodeGraph } from "../graph/types"
import { BaseNode3D } from "../node/types"

/**
 * graph driven compound shape
 * compound of tetrahedron with 4 vertices each
 */
export type Shape = {
  graph: NodeGraph<ShapeNode>
  vertices: Vertex[]
}

export type ShapeNode = GraphNode<BaseNode3D & {
  /**
   * option to calculate vertices' positions
   */  
  option: ShapeNodeOption
  /**
   * 4 vertices for tetrahedron
   */
  vertices: Vertex[]
}>


export type ShapeNodeOption = {
  distanceFromNode: number
}

/**
 * a vertex of a shape
 */
export type Vertex = {
  position: p5.Vector
}