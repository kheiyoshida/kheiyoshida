import { RenderGrid, convertToRenderGrid } from './renderSpec.ts'

export const corridorToNextFloor: RenderGrid = convertToRenderGrid([
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

export const debugStair: RenderGrid = convertToRenderGrid([
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
    stair: 'stair',
  },
  null,
])

export const debugStairClose: RenderGrid = convertToRenderGrid([
  {
    terrain: {
      left: 'wall',
      right: 'wall',
      front: 'wall',
    },
    stair: 'stair',
  },
  null,
  null,
])
