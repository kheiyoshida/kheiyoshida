import { Scaffold } from '../types'
import { iterateScaffold, retrieveScaffoldEntity } from '../utils'
import { applyDistortion } from '.'
import { createDistortionScaffold } from './scaffold'

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
