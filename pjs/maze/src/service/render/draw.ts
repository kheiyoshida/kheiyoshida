import p5, { Geometry } from 'p5'
import { updateImagePixels } from 'p5utils/src/media/image/data'
import { fireByRate, randomFloatBetween } from 'utils'
import { ColorOperationParams } from '../../domain/translate/color/types'
import { RenderGrid } from '../../domain/translate/renderGrid/renderSpec'
import { createColorManager } from './color'
import { calculateGeometries } from './model'
import { ScaffoldValues, createScaffold } from './scaffold'

const ColorManager = createColorManager()

export const drawTerrain = (
  renderGrid: RenderGrid,
  values: ScaffoldValues,
  color: ColorOperationParams
): void => {
  const scaffold = createScaffold(values)
  const geos = calculateGeometries(renderGrid, scaffold)
  ColorManager.resolve(color)
  drawGeometries(geos)
}

export const triggerFadeOut = (frames: number) =>
  ColorManager.setFixedOperation(['fadeout', frames], frames)

const drawGeometries = (geos: Geometry[]): void => {
  p.noStroke()
  p.fill(127)
  // p.texture(getSkin())
  geos.forEach((geo) => p.model(geo))
}

let skin: p5.Image
const getSkin = () => {
  if (!skin) skin = p.createImage(200, 200)
  skin.loadPixels()
  if (fireByRate(0.88)) {
    updateImagePixels(skin, ([r, g, b, a]) => {
      return [120, 120, 120, 255]
    })
  }
  updateImagePixels(skin, ([r, g, b, a]) => {
    if (fireByRate(0.5)) return [120, 120, 120, 255]
    if (fireByRate(0.9)) return [r, g, b, a]
    return [getColorValue(0.2), getColorValue(0.2),getColorValue(0.2), 255]
  })
  skin.updatePixels()

  return skin
}

const getColorValue = (level = 1.0) => 120 + randomFloatBetween(0, 10 * level) * 12
