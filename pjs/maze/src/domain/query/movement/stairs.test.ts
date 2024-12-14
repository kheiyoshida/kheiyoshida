import {
  getGoDownstairsAnimationType,
  getProceedToNextFloorAnimationType,
  GoDownstairsAnimationType,
  ProceedToNextFloorAnimationType,
} from './stairs.ts'

test.each<[...params: Parameters<typeof getGoDownstairsAnimationType>, expected: GoDownstairsAnimationType]>([
  ['default_', 'default_', 'descent'],
  ['default_', 'tiles', 'warp'],
  ['tiles', 'tiles', 'lift'],
  ['tiles', 'poles', 'warp'],
  ['poles', 'poles', 'proceed'],
  ['poles', 'default_', 'warp'],
])(`${getGoDownstairsAnimationType.name}`, (current, next, expected) => {
  expect(getGoDownstairsAnimationType(current, next)).toBe(expected)
})

test.each<
  [
    ...params: Parameters<typeof getProceedToNextFloorAnimationType>,
    expected: ProceedToNextFloorAnimationType,
  ]
>([
  ['default_', 'default_', 'corridor'],
  ['default_', 'tiles', 'still'],
  ['tiles', 'tiles', 'corridor'],
  ['tiles', 'poles', 'still'],
  ['poles', 'poles', 'corridor'],
  ['poles', 'default_', 'still'],
])(`${getProceedToNextFloorAnimationType.name}`, (prev, current, expected) => {
  expect(getProceedToNextFloorAnimationType(prev, current)).toBe(expected)
})
