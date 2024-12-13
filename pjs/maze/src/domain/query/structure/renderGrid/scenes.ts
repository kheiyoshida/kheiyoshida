import { RenderGrid, convertToRenderGrid } from './renderSpec.ts'

export const corridorToNextFloor: RenderGrid = convertToRenderGrid([
  null,
  {
    terrain: {
      left: 'corridor',
      right: 'corridor',
      front: 'wall',
    },
  },
  {
    terrain: {
      left: 'wall',
      right: 'wall',
      front: 'corridor',
    },
  },
])
