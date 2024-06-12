import { GridDirection } from 'mgnr-tone'
import { MusicAesthetics, MusicAlignment, MusicCommand } from '../../domain/translate'

export const createMusicCommandBuffer = () => {
  let alignment: MusicAlignment
  let aesthetics: MusicAesthetics
  const flush = () => {
    alignment = null
    aesthetics = null
  }
  return {
    update: (command: MusicCommand) => {
      alignment = command.alignment
      if (command.aesthetics) {
        aesthetics = command.aesthetics
      }
    },
    get: (): MusicAlignment | MusicAesthetics => {
      const command = aesthetics || alignment
      flush()
      return command
    },
  }
}

export const TranslateMap: Record<
  Exclude<MusicAlignment | MusicAesthetics, null>,
  GridDirection
> = {
  law: 'up',
  chaos: 'down',
  dark: 'left',
  bright: 'right',
}
