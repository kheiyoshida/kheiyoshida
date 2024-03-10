import { RenderGrid, RenderPosition } from '../../../domain/compose/renderSpec'
import { convertRenderGridIntoCoordinates, indexToZValue, positionToXValue } from './position'

describe(`${convertRenderGridIntoCoordinates.name}`, () => {
  const grid: RenderGrid = [null, null, [1, 1, 1], [0, 0, 1], [1, 0, 1], [1, 0, 0]]
  expect(convertRenderGridIntoCoordinates(grid)).toHaveLength(7)
})

describe(`${indexToZValue.name}`, () => {
  test.each([
    [0, -5000],
    [2, -3000],
    [5, 0],
  ] as const)(`layerIndex: %i`, (index, expected) => {
    expect(indexToZValue(index, 1000)).toBe(expected)
  })
})

describe(`${positionToXValue.name}`, () => {
  test.each([
    [RenderPosition.LEFT, -1000],
    [RenderPosition.CENTER, 0],
    [RenderPosition.RIGHT, 1000],
  ] as const)(`renderPosition: %i`, (position, expected) => {
    expect(positionToXValue(position, 1000)).toBe(expected)
  })
})
