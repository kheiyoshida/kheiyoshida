import { RenderPosition } from '../../../../domain/translate/renderGrid/renderSpec'
import { detectModelType, injectGridPositionToModels } from './inject'
import { DynamicModelCode, ModelCodeGrid, StaticModelCode } from './types'

test(`${injectGridPositionToModels.name}`, () => {
  const modelGrid: ModelCodeGrid = [
    [
      [DynamicModelCode.Floor, DynamicModelCode.Ceil],
      [DynamicModelCode.Floor, DynamicModelCode.Ceil],
      [DynamicModelCode.Floor, DynamicModelCode.Ceil],
    ],
    [[DynamicModelCode.FrontWall], [DynamicModelCode.FrontWall], [DynamicModelCode.FrontWall]],
  ]
  const models = injectGridPositionToModels(modelGrid)
  expect(models).toHaveLength(9)
})

test(`${detectModelType.name}`, () => {
  const pos = { x: RenderPosition.CENTER, z: 1 }
  const res = detectModelType(DynamicModelCode.Floor, pos)
  expect(res).toEqual({
    code: DynamicModelCode.Floor,
    type: 'dynamic',
    position: pos,
  })
  const res2 = detectModelType(StaticModelCode.Pole, pos)
  expect(res2).toEqual({
    code: StaticModelCode.Pole,
    type: 'static',
    position: pos,
  })
})
