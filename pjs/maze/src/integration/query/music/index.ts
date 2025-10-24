import { IntRange } from 'utils'
import { maze, player } from '../../../game'

export type MusicRange = IntRange<1, 10>
export type MusicCommand = {
  alignment: MusicRange
  aesthetics: MusicRange,
}

export const getMusicCommands = (): MusicCommand => ({
  alignment: calcMusicAlignment(player.status.sanity),
  aesthetics: maze.getStageContext().current.style as MusicRange,
})

export const calcMusicAlignment = (sanity: number): MusicRange => {
  if (sanity >= 2700) return 9
  if (sanity >= 2400) return 8
  if (sanity >= 2100) return 7
  if (sanity >= 1800) return 6
  if (sanity >= 1500) return 5
  if (sanity >= 1200) return 4
  if (sanity >= 900) return 3
  if (sanity >= 600) return 2
  if (sanity >= 300) return 1
  return 1
}
