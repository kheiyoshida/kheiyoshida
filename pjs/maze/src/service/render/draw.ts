import p5, { Geometry } from 'p5'
import { updateImagePixels } from 'p5utils/src/media/image/data'
import { fireByRate, randomIntInclusiveBetween } from 'utils'
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
  if (!skin) skin = p.createImage(50, 50)
  skin.loadPixels()
  updateImagePixels(skin, ([r, g, b, a]) => {
    // if (fireByRate(0.2)) return [r,g,b,a]
    if (fireByRate(0.5)) return [120, 120, 120, 255]
    // const v = fireByRate(0.5) ? 120 : randomIntInclusiveBetween(0, 250)
    return [randomIntInclusiveBetween(120, 250),randomIntInclusiveBetween(120, 250),randomIntInclusiveBetween(120, 250), 255]
  })
  skin.updatePixels()
  return skin
}
