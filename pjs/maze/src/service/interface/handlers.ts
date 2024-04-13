import { RenderHandler } from '../consumer'
import { renderFloor } from './floor'

export const showFloor: RenderHandler = ({ map: { floor } }) => {
  renderFloor(floor)
}
