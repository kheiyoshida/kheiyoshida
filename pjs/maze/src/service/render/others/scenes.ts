import { RenderGrid, convertToRenderGrid } from '../../../domain/translate/compose/renderSpec'

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
