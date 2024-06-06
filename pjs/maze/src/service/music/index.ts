import { demo } from 'music'
import * as Tone from 'tone'

const music = demo.createMusic(demo.themeGrid)

export const musicCommandBuffer = demo.createCommandBuffer()

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
        music.checkNextTheme(musicCommandBuffer.command)
      },
      checkInterval,
      0
    )
    started = true
  }
}

export const setupMusic = makeSetupMusic()
