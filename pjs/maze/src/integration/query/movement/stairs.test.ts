import {
  getGoDownstairsAnimationType,
  getProceedToNextFloorAnimationType,
  GoDownstairsAnimationType,
  ProceedToNextFloorAnimationType,
} from './stairs.ts'

test.each<[...params: Parameters<typeof getGoDownstairsAnimationType>, expected: GoDownstairsAnimationType]>([
  ['classic', 'classic', 'descent'],
  ['classic', 'tiles', 'warp'],
  ['tiles', 'tiles', 'lift'],
  ['tiles', 'poles', 'warp'],
  ['poles', 'poles', 'proceed'],
  ['poles', 'classic', 'warp'],
])(`${getGoDownstairsAnimationType.name}`, (current, next, expected) => {
  expect(getGoDownstairsAnimationType(current, next)).toBe(expected)
})

test.each<
  [
    ...params: Parameters<typeof getProceedToNextFloorAnimationType>,
    expected: ProceedToNextFloorAnimationType,
  ]
>([
  ['classic', 'classic', 'corridor'],
  ['classic', 'tiles', 'still'],
  ['tiles', 'tiles', 'corridor'],
  ['tiles', 'poles', 'still'],
  ['poles', 'poles', 'corridor'],
  ['poles', 'classic', 'still'],
])(`${getProceedToNextFloorAnimationType.name}`, (prev, current, expected) => {
  expect(getProceedToNextFloorAnimationType(prev, current)).toBe(expected)
})
