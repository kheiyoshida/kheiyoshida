import { Structure } from '../../world/types.ts'

export type PhysicalStairType = 'normal' | 'warp'

export const getPhysicalStairType = (
  currentLevelStructure: Structure,
  nextLevelStructure: Structure
): PhysicalStairType => (currentLevelStructure === nextLevelStructure ? 'normal' : 'warp')
