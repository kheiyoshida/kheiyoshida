import { frameWidthAndHeight } from "./maze/domain/vision/frame/helpers"
import { wallPictureFrame } from './maze/domain/vision/frame/altFrame'
import { Layer } from './maze/domain/vision/frame'
import { Terrain } from "./maze/service/render/compose/nodeSpec"
import { callWallPicture, emptyPicture } from "./maze/service/render/others/wall"

export const isDeadEnd = (a: Terrain) => {
  return a.front === 'wall' && a.front === a.right && a.right === a.left
}

export const deadEnd = (l: Layer, close: boolean, nodePos: number[]) => {
  const pf = wallPictureFrame(l.front)
  const [w, h] = frameWidthAndHeight(pf)
  if (close) {
    return callWallPicture(pf.tl, [w, h], nodePos)
  } else {
    emptyPicture(pf.tl, [w, h])
  }
}

// make this event
// const _renderDeadEnd = (
//   around: Terrain,
//   backLayer: Layer,
//   nodeIndex: number,
//   node: Node
// ) => {
//   if (isDeadEnd(around)) {
//     deadEnd(backLayer, nodeIndex === 0, node.pos)
//   }
// }
