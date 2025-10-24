import { LogicalView, convertToLogicalView } from '../../../game/view/logicalView.ts'

export const corridorToNextFloor: LogicalView = convertToLogicalView([
  {
    terrain: {
      left: 'wall',
      right: 'wall',
      front: 'corridor',
    },
  },
  {
    terrain: {
      left: 'wall',
      right: 'wall',
      front: 'corridor',
    },
  },
  {
    terrain: {
      left: 'corridor',
      right: 'corridor',
      front: 'wall',
    },
  },
])

export const debugStair: LogicalView = convertToLogicalView([
  {
    terrain: {
      left: 'wall',
      right: 'wall',
      front: 'corridor',
    },
  },
  {
    terrain: {
      left: 'wall',
      right: 'wall',
      front: 'wall',
    },
    stair: 'normal',
  },
  null,
])

export const debugStairClose: LogicalView = convertToLogicalView([
  {
    terrain: {
      left: 'wall',
      right: 'wall',
      front: 'wall',
    },
    stair: 'normal',
  },
  null,
  null,
])
