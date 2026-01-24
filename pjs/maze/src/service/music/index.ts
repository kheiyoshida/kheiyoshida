import { makeContextManager, maze } from 'music'
import { RenderHandler } from '../consumer'

import { MusicRange } from '../../integration/query'

let buffer: [MusicRange, MusicRange]
let changeModeRequired = false

const setupMusic = () => {
  const music = maze.makeMusic()
  return makeContextManager({
    ...music.config,
    initialise: () => music.applyInitialScene(),
    onInterval: () => {
      music.moveToDest(buffer)
      console.log(music.currentPosition.parentGridPosition, music.currentPosition.childGridPosition)
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
  let currentLevel: number
  return ({ map }) => {
    if (currentLevel !== map.floor && map.floor % 10 === 0) {
      currentLevel = map.floor
      changeModeRequired = true
    }
  }
})()
