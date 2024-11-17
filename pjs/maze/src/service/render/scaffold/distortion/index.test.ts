import { Scaffold } from '../types.ts'
import { iterateScaffold, retrieveScaffoldEntity } from '../utils.ts'
import { applyDistortion } from './index.ts'
import { createDistortionScaffold } from './scaffold.ts'

test(`${applyDistortion.name}`, () => {
  const original: Scaffold = [
    {
      lower: [
        [-1500, 500, 500],
        [-500, 500, 500],
        [500, 500, 500],
        [1500, 500, 500],
      ],
      upper: [
        [-1500, -500, 500],
        [-500, -500, 500],
        [500, -500, 500],
        [1500, -500, 500],
      ],
    },
    {
      lower: [
        [-1500, 500, -500],
        [-500, 500, -500],
        [500, 500, -500],
        [1500, 500, -500],
      ],
      upper: [
        [-1500, -500, -500],
        [-500, -500, -500],
        [500, -500, -500],
        [1500, -500, -500],
      ],
    },
  ]
  const scaffold = JSON.parse(JSON.stringify(original))
  const distScaffold = createDistortionScaffold()
  distScaffold.updateDeltas(100, 1)
  applyDistortion(scaffold, distScaffold)
  iterateScaffold(scaffold, (entity, key) => {
    expect(entity).not.toMatchObject(retrieveScaffoldEntity(original, key))
  })
})
