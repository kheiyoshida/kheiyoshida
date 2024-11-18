import { getRenderBlock, RenderBlockPosition, Scaffold } from '../scaffold'
import { GeometryCode, UnitSpec } from '../unit'
import { DeformedBox, Eye, RenderUnit, Scene } from 'maze-gl'
import { getMesh } from '../mesh'

// TODO: make this dynamic in eye module
const eye: Eye = {
  sight: 8000,
  fov: 5 / Math.PI,
  position: [0, 0, 1000],
  direction: 0,
  aspectRatio: window.innerWidth / window.innerHeight,
}

const unit1: RenderUnit = {
  box: {
    FBL: [1,1,1],
    FBR: [1,1,1],
    FTL: [1,1,1],
    FTR: [1,1,1],
    BBL: [1,1,1],
    BBR: [1,1,1],
    BTL: [1,1,1],
    BTR: [1,1,1],
  },
  meshes: [
    getMesh(GeometryCode.FrontWall)
  ],
}

export const composeScene = (scaffold: Scaffold, specList: UnitSpec[]): Scene => {
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
