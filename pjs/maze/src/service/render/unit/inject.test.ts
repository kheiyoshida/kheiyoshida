import { injectGridPositionToModels } from './inject.ts'
import { ModelCode, ModelCodeGrid } from './model/types.ts'

test(`${injectGridPositionToModels.name}`, () => {
  const modelGrid: ModelCodeGrid = [
    [
      [ModelCode.Floor, ModelCode.Ceil],
      [ModelCode.Floor, ModelCode.Ceil],
      [ModelCode.Floor, ModelCode.Ceil],
    ],
    [[ModelCode.FrontWall], [ModelCode.FrontWall], [ModelCode.FrontWall]],
  ]
  const models = injectGridPositionToModels(modelGrid)

  expect(models).toEqual(
    [
      {
        keys: ['Floor', 'Ceil'],
        position: {
          x: 0,
          z: 0,
        },
      },
      {
        keys: ['Floor', 'Ceil'],
        position: {
          x: 1,
          z: 0,
        },
      },
      {
        keys: ['Floor', 'Ceil'],
        position: {
          x: 2,
          z: 0,
        },
      },
      {
        keys: ['FrontWall'],
        position: {
          x: 0,
          z: 1,
        },
      },
      {
        keys: ['FrontWall'],
        position: {
          x: 1,
          z: 1,
        },
      },
      {
        keys: ['FrontWall'],
        position: {
          x: 2,
          z: 1,
        },
      },
    ],
  )
})
