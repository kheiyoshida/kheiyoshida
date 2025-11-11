
export type ModelId = {
  code: ModelCode
  variant?: number
}

export type ModelCode =
  | 'Floor'
  | 'Ceil'
  | 'Wall'
  | 'Octahedron'
  | 'Pole'
  | 'Tile'
  | 'StairTile'
  | 'StairCeil'
  | 'StairSteps'
