import { RenderPosition } from 'maze/src/domain/translate/renderGrid/renderSpec'
import { ConvertModelMap } from 'maze/src/service/render/unit/coords/models'
import { finalizeGeometries } from 'maze/src/service/render/unit/finalize/finalize'
import {
  RenderBlockCoords,
  RenderBlockPosition,
  UnitSpec,
} from 'pjs/maze/src/service/render/unit/model/types.ts'
import { pushPop } from 'p5utils/src/render'

export const renderBlock: RenderBlockCoords = {
  front: {
    bl: [-500, 500, 500],
    br: [500, 500, 500],
    tl: [-500, -500, 500],
    tr: [500, -500, 500],
  },
  rear: {
    bl: [-500, 500, -500],
    br: [500, 500, -500],
    tl: [-500, -500, -500],
    tr: [500, -500, -500],
  },
}

export const renderBlockCoords = () => {
  Object.values(renderBlock.front).forEach((pos) => {
    pushPop(() => {
      p.translate(...pos)
      p.sphere(10)
    })
  })
  Object.values(renderBlock.rear).forEach((pos) => {
    pushPop(() => {
      p.translate(...pos)
      p.sphere(10)
    })
  })
}

export const renderModel = (
  model: UnitSpec = UnitSpec.Stair,
  position: RenderBlockPosition = { x: RenderPosition.CENTER, y: 0, z: 0 }
) => {
  const spec = ConvertModelMap[model]({ blockCoords: renderBlock, position })
  const geometries = finalizeGeometries(spec)
  geometries.forEach((geo) => p.model(geo))
}
