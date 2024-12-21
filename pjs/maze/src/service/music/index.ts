import { makeContextManager, maze } from 'music'
import { RenderHandler } from '../consumer'

import { MusicRange } from '../../domain/query'
import { RenderingMode } from '../../store/stage.ts'

let buffer: [MusicRange, MusicRange]
let changeModeRequired = false

const setupMusic = () => {
  const music = maze.makeMusic()
  return makeContextManager({
    ...music.config,
    initialise: () => music.applyInitialScene(),
    onInterval: () => {
      music.moveToDest(buffer)
      if (changeModeRequired) {
        music.changeMode()
        changeModeRequired = false
      }
    },
  })
}

export const musicContext = setupMusic()

export const updateMusicDest: RenderHandler = (pack) => {
  buffer = [pack.music.aesthetics, pack.music.alignment]
  checkNewMusicModeRequired(pack)
}

const checkNewMusicModeRequired = ((): RenderHandler => {
  let currentMode: RenderingMode | undefined
  return ({ vision }) => {
    if (currentMode === undefined) {
      currentMode = vision.mode
      return
    }
    if (currentMode !== vision.mode) {
      currentMode = vision.mode
      changeModeRequired = true
    }
  }
})()
