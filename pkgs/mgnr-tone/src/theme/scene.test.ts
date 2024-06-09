import { GridAlignment } from './grid'
import { determineInitialLevel } from './scene'

test.each<[GridAlignment, ReturnType<typeof determineInitialLevel>]>([
  [
    'center-bottom',
    {
      top: 2,
      bottom: 4,
      right: 3,
      left: 3,
      center: 3,
    },
  ],
  [
    'right-middle',
    {
      top: 3,
      bottom: 3,
      right: 4,
      left: 2,
      center: 3,
    },
  ],
])(`${determineInitialLevel.name} (%s)`, (alignment, result) => {
  expect(determineInitialLevel(alignment)).toEqual(result)
})
