import { StatsUpdatePattern, StatusEventValues } from './params/status.ts'
import { player } from './setup.ts'

export const updatePlayerStats = (pattern: StatsUpdatePattern) =>
  player.updateStatus(StatusEventValues[pattern])

