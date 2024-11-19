import { getRenderBlock, RenderBlockPosition, Scaffold } from '../scaffold'
import { UnitSpec } from '../unit'
import { DeformedBox, Eye, RenderUnit, Scene } from 'maze-gl'
import { getMesh } from '../mesh'

export const composeScene = (scaffold: Scaffold, specList: UnitSpec[], eye: Eye): Scene => {
  const units: RenderUnit[] = specList.map((spec) => ({
    box: getDeformedBox(scaffold, spec.position),
    meshes: spec.codes.map(getMesh),
  }))

  return {
    eye,
    units,
  }
}

const getDeformedBox = (scaffold: Scaffold, position: RenderBlockPosition): DeformedBox => {
  const block = getRenderBlock(scaffold, position)
  return {
    FBL: block.front.bl,
    FBR: block.front.br,
    FTL: block.front.tl,
    FTR: block.front.tr,
    BBL: block.rear.bl,
    BBR: block.rear.br,
    BTL: block.rear.tl,
    BTR: block.rear.tr,
  }
}
