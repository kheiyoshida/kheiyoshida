import { getMesh } from './mesh.ts'
import { ObjectTransform, SceneObject } from 'maze-gl'
import { MazeObject } from '../../../game/maze/physical/object.ts'
import { NESW } from '../../../core/grid/direction.ts'
import { Atmosphere } from '../../../game/world/types.ts'

export const composeSceneObject = (mode: Atmosphere) => (obj: MazeObject) => {
  const {
    model: { code },
  } = obj

  const transform = new ObjectTransform({
    rotateY: 0,
    scale: 1,
  })

  transform.rotateY = NESW.indexOf(obj.direction) * 90

  return new SceneObject(getMesh(obj.model, mode), transform)
}
