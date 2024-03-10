import { drawAtPosition3D } from 'p5utils/src/render'
import { Vision } from '../vision'
import { convertRenderGridIntoCoordinates } from './position'
import { getPalette } from '../vision/color/palette'

export const renderCurrentView3d =
  ({ renderGrid }: Vision) =>
  () => {
    const coordinates = convertRenderGridIntoCoordinates(renderGrid)
    p.background(getPalette().fill)
    coordinates.forEach((position3d) => {
      drawAtPosition3D(position3d, () => {
        p.fill(100)
        p.box(1000)
      })
    })
  }
