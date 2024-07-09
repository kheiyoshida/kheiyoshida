import { makeContextManager, maze } from 'music'
import { RenderHandler } from '../consumer'
import { MusicRange } from '../../domain/translate'

let buffer: [MusicRange,MusicRange]

const setupMusic = () => {
  const music = maze.makeMusic()
  const context = makeContextManager({
    ...music.config,
    initialise: () => music.applyInitialScene(),
    onInterval: () => {
      music.moveToDest(buffer)
    },
  })
  return context
}

export const music = setupMusic()

export const updateMusicDest: RenderHandler = (pack) => {
  buffer = [pack.music.aesthetics, pack.music.alignment]
}
