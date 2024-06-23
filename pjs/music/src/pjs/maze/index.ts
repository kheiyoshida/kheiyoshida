import {
  GridDirection,
  SceneGrid,
  SceneShiftInfo,
  createMusicState,
  nthDegreeTone,
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
    const makeScene = scenes.getInitialScene()
    const scene = makeScene(scaleSource, 'center-middle')
    const result = state.applyScene(scene, Tone.Transport.toSeconds('@4m'))
    Object.values(result.in).forEach((outlet) => {
      const ch = channels[outlet as AvailableOutlets]
      if (!ch) throw Error(`channel not found: ${outlet}`)
      ch.dynamicVolumeFade(ch.volumeRangeDiff, '2m')
    })
  }

  function checkNextShift(...commands: GridDirection[]) {
    const shift = commands.reduce((_, command) => scenes.move(command), {} as SceneShiftInfo)
    console.log(shift)
    fadeInNextTheme(shift)
    if (scaleSource.inModulation || scenes.current.isOnEdge) {
      scaleSource.modulateAll(
        {
          key: nthDegreeTone(scaleSource.conf.key, randomItemFromArray(['4', '5', '6'])),
          pref: randomItemFromArray(['omit25', 'omit27', 'omit47', 'major']),
        },
        2
      )
    }
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
