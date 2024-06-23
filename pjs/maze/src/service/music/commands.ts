import { GridDirection } from 'mgnr-tone'
import { MusicAesthetics, MusicAlignment, MusicCommand } from '../../domain/translate'

type MusicSignal = Exclude<MusicAesthetics | MusicAlignment, null>

export const createMusicCommandBuffer = () => {
  let alignment: MusicAlignment
  let aesthetics: MusicAesthetics
  const flush = () => {
    alignment = null
    aesthetics = null
  }
  return {
    update: (command: MusicCommand) => {
      if (command.alignment) {
        alignment = command.alignment
      }
      if (command.aesthetics) {
        aesthetics = command.aesthetics
      }
    },
    get: (): MusicSignal[] => {
      const command = [aesthetics, alignment].filter((sig): sig is MusicSignal => Boolean(sig))
      flush()
      return command
    },
  }
}

export const TranslateMap: Record<Exclude<MusicSignal, null>, GridDirection> = {
  law: 'up',
  chaos: 'down',
  dark: 'left',
  bright: 'right',
}
