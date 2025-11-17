import { getMesh } from './mesh.ts'
import { ObjectTransform, SceneObject } from 'maze-gl'
import { randomFloatBetween } from 'utils'
import { MazeObject } from '../../../game/maze/physical/object.ts'
import { NESW } from '../../../core/grid/direction.ts'
import { Atmosphere } from '../../../game/world'

export const composeSceneObject = (mode: Atmosphere) => (obj: MazeObject) => {
  const {
    model: { code },
  } = obj

  const transform = new ObjectTransform({
    rotateY: 0,
    scale: 1,
  })

  if (code === 'Warp') {
    transform.scale = randomFloatBetween(0.2, 0.4)
  }
  if (code === 'Pole') {
    transform.scale = 0.7
  }
  if (code === 'Tile') {
    transform.scale = 0.9
  }

  transform.rotateY = NESW.indexOf(obj.direction) * 90

  return new SceneObject(getMesh(obj.model, mode), transform)
}
