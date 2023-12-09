import p5 from "p5"

/**
 * base type for node object
 */
export type BaseNode = {
  /**
   * position
   */
  position: p5.Vector

  /**
   * movement vector
   */
  move: p5.Vector

  /**
   * if dead, it should be removed from graph and edges of other nodes
   */
  dead?: boolean
}

/**
 * base type for node (in 3D projects)
 */
export type BaseNode3D = BaseNode & {
  /**
   * movement angles stored for calculation
   */
  angles: VectorAngles
}

/**
 * angles to determine 3d vector
 */
export type VectorAngles = {
  theta: number,
  phi: number
}

/**
 * territory to restrain node's position (in 2D)
 */
export type NodeTerritory = {
  l: number
  r: number
  t: number
  b: number 
}
