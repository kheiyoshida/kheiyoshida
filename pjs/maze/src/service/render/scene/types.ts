
export type EyeMovementValues = {
  /**
   * amount of movement from the default position where z=0
   * in range of 0 to 1 where 1 means the end of movement
   */
  move?: number

  /**
   * amount of turn in range of 0 to 1
   */
  turn?: number

  /**
   * amount of y-descent.
   * 1.0 moves y by the current wall height
   */
  descend?: number
}
