import {
  GridDirection,
  SceneGrid,
  SceneShiftInfo,
  createMusicState,
  pickRandomPitchName,
} from 'mgnr-tone'
import * as Tone from 'tone'
import { AvailableOutlets, makeDefaultScenes } from './scenes'
import { createDefaultTheme } from './theme'
import { fireByRate, randomIntInclusiveBetween, randomItemFromArray } from 'utils'

export type Music = {
  applyInitialScene: () => void
  checkNextShift: (...commands: GridDirection[]) => void
  currentPosition: SceneGrid['current']
  config: {
    bpm: number
    interval: string
  }
}

export const makeMusic = (): Music => {
  const scenes = makeDefaultScenes()
  const { channels, scaleSource, outlets, handlefade } = createDefaultTheme()

  const state = createMusicState(outlets)

  function applyInitialScene() {
    const makeScene = scenes.getInitialScene('center-middle')
    const scene = makeScene(scaleSource, 'center-middle')
    // const result = state.applyScene(scene, Tone.Transport.toSeconds('@4m'))
    const result = state.applyScene(scene, Tone.Transport.toSeconds('0:0:0'))
    Object.values(result.in).forEach((outlet) => {
      const ch = channels[outlet as AvailableOutlets]
      if (!ch) throw Error(`channel not found: ${outlet}`)
      ch.dynamicVolumeFade(ch.volumeRangeDiff, '2m')
    })
  }

  function checkNextShift(...commands: GridDirection[]) {
    // if (scaleSource.inModulation || fireByRate(0.3)) {
    //   scaleSource.modulateAll(
    //     { key: pickRandomPitchName(), pref: randomItemFromArray(['omit25', 'omit27', 'omit47']) },
    //     4
    //   )
    // }
    console.log(commands)
    const shift = commands.reduce((_, command) => scenes.move(command), {} as SceneShiftInfo)
    console.log(shift)
    fadeInNextTheme(shift)
  }

  function fadeInNextTheme({ makeScene, sceneAlignment, direction }: SceneShiftInfo) {
    const scene = makeScene!(scaleSource, sceneAlignment)
    const result = state.applyScene(scene)
    handlefade(result, direction)
  }

  return {
    applyInitialScene,
    checkNextShift,
    get currentPosition() {
      return scenes.current
    },
    get config() {
      return {
        bpm: randomIntInclusiveBetween(96, 110),
        interval: '8m',
      }
    },
  }
}
