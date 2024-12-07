
export type Effect = {
  /**
   * expects 0.0 ~ 1.0 range
   * 0.0 hides most of the terrain in sight,
   * 1.0 reveals the terrain
   */
  fogLevel: number;
}
