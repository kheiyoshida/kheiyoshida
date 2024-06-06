import { demo } from 'music'
import * as Tone from 'tone'
import { TranslateMap, createMusicCommandBuffer } from './commands'
import { RenderHandler } from '../consumer'

const music = demo.createMusic(demo.themeGrid)

const buffer = createMusicCommandBuffer()

const makeSetupMusic = (bpm = 162, checkInterval = '16m') => {
  let started = false
  return () => {
    if (Tone.context.state === 'suspended') {
      Tone.start()
    }
    if (started) return
    Tone.Transport.bpm.value = bpm
    Tone.Transport.start(0)
    music.applyInitialTheme()
    Tone.Transport.scheduleRepeat(
      () => {
        const command = buffer.get()
        if (command) {
          music.checkNextTheme(TranslateMap[command])
        }
      },
      checkInterval,
      0
    )
    started = true
  }
}

export const setupMusic = makeSetupMusic()

export const updateMusicAesthetics: RenderHandler = (pack) => {
  buffer.update({ aesthetics: pack.music.aesthetics, alignment: null })
}

export const updateMusicAlignment: RenderHandler = (pack) => {
  buffer.update({ aesthetics: null, alignment: pack.music.alignment })
}
