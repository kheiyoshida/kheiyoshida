import { Structure, StructureContext } from '../world/types.ts'
import { StairPositionConstraint } from '../../core/level/builder'

export type StairType = 'stair' | 'lift' | 'path'
export type StairPosition = StairPositionConstraint

export type StairSpec = {
  position: StairPosition
  type: StairType
}

type StructureType = 'stacked' | 'classic' | 'floating'
const classify = (structure: Structure): StructureType => {
  switch (structure) {
    case 'stackedBoxes':
      return 'stacked'
    case 'poles':
      return 'stacked'
    case 'classic':
      return 'classic'
    case 'floatingBoxes':
      return 'floating'
    case 'tiles':
      return 'floating'
  }
}

const table: Record<StructureType, Record<StructureType, StairSpec>> = {
  stacked: {
    stacked: {
      position: 'exit',
      type: 'stair',
    },
    classic: {
      position: 'exit',
      type: 'path',
    },
    floating: {
      position: 'deadEnd',
      type: 'lift',
    },
  },
  classic: {
    stacked: {
      position: 'exit',
      type: 'path',
    },
    classic: {
      position: 'exit',
      type: 'stair',
    },
    floating: {
      position: 'exit',
      type: 'lift',
    },
  },
  floating: {
    stacked: {
      position: 'exit',
      type: 'stair',
    },
    classic: {
      position: 'exit',
      type: 'path',
    },
    floating: {
      position: 'deadEnd',
      type: 'lift',
    },
  },
}

export const getStairSpec = (structureContext: StructureContext): StairSpec => {
  const { current, next } = structureContext
  if (!next) throw new Error('next structure not defined')

  const currentType = classify(current)
  const nextType = classify(next)

  return table[currentType][nextType]
}
