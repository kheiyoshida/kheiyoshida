import { getStairSpec, StairSpec } from './stair.ts'
import { Structure } from '../world/types.ts'

test.each<[from: Structure, toStacked: StairSpec, toClassic: StairSpec, toFloating: StairSpec]>([
  [
    'stackedBoxes',
    { position: 'exit', type: 'stair' },
    { position: 'exit', type: 'path' },
    { position: 'deadEnd', type: 'lift' },
  ],
  [
    'classic',
    { position: 'exit', type: 'path' },
    { position: 'deadEnd', type: 'stair' },
    { position: 'deadEnd', type: 'lift' },
  ],
  [
    'floatingBoxes',
    { position: 'exit', type: 'stair' },
    { position: 'exit', type: 'path' },
    { position: 'deadEnd', type: 'lift' },
  ],
])(`${getStairSpec.name}`, (from, toStacked, toClassic, toFloating) => {
  expect(getStairSpec({ prev: undefined, current: from, next: 'stackedBoxes' })).toMatchObject(toStacked)
  expect(getStairSpec({ prev: undefined, current: from, next: 'classic' })).toMatchObject(toClassic)
  expect(getStairSpec({ prev: undefined, current: from, next: 'floatingBoxes' })).toMatchObject(toFloating)
})
