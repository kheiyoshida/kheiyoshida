import { maze, makeContextManager } from 'music'
import { RenderHandler } from '../consumer'
import { TranslateMap, createMusicCommandBuffer } from './commands'

const buffer = createMusicCommandBuffer()

const setupMusic = () => {
  const music = maze.makeMusic()
  const context = makeContextManager({
    ...music.config,
    initialise: () => music.applyInitialScene(),
    onInterval: () => {
      const commands = buffer.get()
      if (commands.length) {
        music.checkNextShift(...commands.map(c => TranslateMap[c]))
      }
    },
  })
  return context
}

export const music = setupMusic()

export const updateMusicAesthetics: RenderHandler = (pack) => {
  buffer.update({ aesthetics: pack.music.aesthetics, alignment: null })
}

export const updateMusicAlignment: RenderHandler = (pack) => {
  buffer.update({ aesthetics: null, alignment: pack.music.alignment })
}
