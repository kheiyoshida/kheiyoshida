import { Camera } from 'p5utils/src/camera/types'
import { FieldRange } from '../constants'

export const restrictPosition = (camera: Camera, callback?: () => void) => {
  const [x, _, z] = camera.position
  if (x > FieldRange) {
    camera.setPosition(-FieldRange, 0, z)
    onEdge()
  }
  if (x < -FieldRange) {
    camera.setPosition(FieldRange, 0, z)
    onEdge()
  }
  if (z > FieldRange) {
    camera.setPosition(x, 0, -FieldRange)
    onEdge()
  }
  if (z < -FieldRange) {
    camera.setPosition(x, 0, FieldRange)
    onEdge()
  }
  function onEdge  () {
    camera.setFocus([0, 0, 0])
    camera.turn({theta: 0, phi: 0})
    callback && callback()
  }
}
