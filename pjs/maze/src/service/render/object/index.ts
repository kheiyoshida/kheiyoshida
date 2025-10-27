import { RenderingMode } from '../../../game/stage'
import { getMesh } from './mesh.ts'
import { ObjectTransform, SceneObject } from 'maze-gl'
import { randomFloatBetween } from 'utils'
import { ModelCode } from '../../../game/maze/physical/models.ts'

export const composeSceneObject = (code: ModelCode, mode: RenderingMode) => {
  const transform = new ObjectTransform({
    rotateY: 0,
    scale: 1,
  })

  if (code === 'Octahedron') {
    transform.scale = randomFloatBetween(0.2, 0.4)
  }
  if (code === 'Pole') {
    transform.scale = 0.7
  }
  if (code === 'Tile') {
    transform.scale = 0.9
  }

  return new SceneObject(getMesh(code, mode), transform)
}
