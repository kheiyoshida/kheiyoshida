import { Scaffold } from './types'
import { slideScaffoldLayers } from './utils'

test(`${slideScaffoldLayers.name}`, () => {
  const layer0 = {
    upper: [1, 2, 3, 4],
    lower: [5, 6, 7, 8],
  }
  const layer1 = {
    upper: [9, 10, 11, 12],
    lower: [13, 14, 15, 16],
  }
  const scaffold: Scaffold<number> = [layer0, layer1]
  const result = slideScaffoldLayers(scaffold, 1, () => layer0)
  expect(result[0]).toMatchObject(layer1)
  expect(result[1]).toMatchObject(layer0)
})
