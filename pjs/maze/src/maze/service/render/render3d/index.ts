import { drawAtPosition3D } from 'p5utils/src/render'
import { Vision } from '../vision'
import { convertRenderGridIntoCoordinates } from './position'

export const renderCurrentView3d =
  ({ renderGrid }: Vision) =>
  () => {
    const coordinates = convertRenderGridIntoCoordinates(renderGrid)
    coordinates.forEach((position3d) => {
      drawAtPosition3D(position3d, () => {
        p.box(1000)
      })
    })
  }
