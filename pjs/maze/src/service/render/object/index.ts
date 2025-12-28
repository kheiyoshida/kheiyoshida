import { getModel } from './model.ts'
import { ObjectTransform, SceneObject } from 'maze-gl'
import { MazeObject } from '../../../game/maze/physical/object.ts'
import { NESW } from '../../../core/grid/direction.ts'

export const composeSceneObject = (obj: MazeObject) => {
  const transform = new ObjectTransform({
    rotateY: 0,
    scale: 1,
  })

  transform.rotateY = NESW.indexOf(obj.direction) * 90

  return new SceneObject(getModel(obj.model), transform)
}
