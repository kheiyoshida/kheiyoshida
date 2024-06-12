import { demo, makeContextManager } from 'music'
import { RenderHandler } from '../consumer'
import { TranslateMap, createMusicCommandBuffer } from './commands'

const buffer = createMusicCommandBuffer()

const makeSetupMusic = () => {
  const music = demo.makeMusic()
  const context = makeContextManager({
    ...music.config,
    initialise: () => music.applyInitialScene(),
    onInterval: () => {
      const command = buffer.get()
      if (command) {
        music.checkNextShift(TranslateMap[command])
      }
    },
  })
  return () => {
    context.startContext()
    context.startPlaying()
  }
}

export const setupMusic = makeSetupMusic()

export const updateMusicAesthetics: RenderHandler = (pack) => {
  buffer.update({ aesthetics: pack.music.aesthetics, alignment: null })
}

export const updateMusicAlignment: RenderHandler = (pack) => {
  buffer.update({ aesthetics: null, alignment: pack.music.alignment })
}
