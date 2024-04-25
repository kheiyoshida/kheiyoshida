import p5, { Geometry } from 'p5'
import { ColorOperationParams } from '../../domain/translate/color/types'
import { RenderGrid } from '../../domain/translate/renderGrid/renderSpec'
import { createColorManager } from './color'
import { calculateGeometries } from './model'
import { ScaffoldValues, createScaffold } from './scaffold'
import { randomizeImagePixels, updateImagePixels } from 'p5utils/src/media/image/data'
import { clamp, fireByRate, randomIntInAsymmetricRange, randomIntInclusiveBetween } from 'utils'

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
  p.texture(getSkin())
  geos.forEach((geo) => p.model(geo))
}

let skin: p5.Image
const getSkin = () => {
  if (!skin) skin = p.createImage(300, 300)
  skin.loadPixels()
  updateImagePixels(skin, ([r, g, b, a]) => {
    if (fireByRate(0.99)) return [20, 20, 20, 255]
    if (fireByRate(0.1)) return [0, 0, 0, 255]
    return [randomIntInclusiveBetween(0, 10), 20, 20, 255]
  })
  skin.updatePixels()
  return skin
}
