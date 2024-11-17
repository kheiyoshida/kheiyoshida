export type ModelCodeGrid = ModelCodeGridLayer[]
export type ModelCodeGridLayer = [ModelCode[], ModelCode[], ModelCode[]]

export enum ModelCode {
  Floor = 'Floor',
  Ceil = 'Ceil',
  SideWall = 'SideWall',
  FrontWall = 'FrontWall',
  Stair = 'Stair',
  StairCeil = 'StairCeil',
  BoxTop = 'BoxTop',
  BoxMiddle = 'BoxMiddle',
  BoxBottom = 'BoxBottom',
  BoxStair = 'BoxStair',
}
