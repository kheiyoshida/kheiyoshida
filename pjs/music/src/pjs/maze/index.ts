import { createMusicState, nthDegreeTone } from 'mgnr-tone'
import { GridDirection, SceneGrid, SceneShiftInfo } from '../../grid'
import * as Tone from 'tone'
import { randomItemFromArray } from 'utils'
import { AvailableOutlets, makeDefaultScenes } from './scenes'
import { createDefaultTheme } from './theme'

export type Music = {
  applyInitialScene: () => void
  checkNextShift: (...commands: GridDirection[]) => void
  moveToDest: (dest: Parameters<SceneGrid['moveTowardsDestination']>[0]) => void
  changeMode: () => void
  currentPosition: SceneGrid['current']
  config: {
    bpm: number
    interval: string
  }
}

export const makeMusic = (): Music => {
  const scenes = makeDefaultScenes()
  const { channels, scaleSource, outlets, handleFade } = createDefaultTheme()

  const state = createMusicState(outlets)

  function applyInitialScene() {
    const makeScene = scenes.getInitialScene()
    const scene = makeScene(scaleSource, 'center-middle')
    const result = state.applyScene(scene, Tone.Transport.toSeconds('@4m')) // @4m
    // const result = state.applyScene(scene, 0) // why can't start at 0?
    Object.values(result.in).forEach((outlet) => {
      const ch = channels[outlet as AvailableOutlets]
      if (!ch) throw Error(`channel not found: ${outlet}`)
      ch.dynamicVolumeFade(ch.volumeRangeDiff, '6m')
    })
  }

  function moveToDest(dest: Parameters<SceneGrid['moveTowardsDestination']>[0]) {
    const shift = scenes.moveTowardsDestination(dest)
    if (!shift) return
    fadeInNextTheme(shift)
    if (scaleSource.inModulation) {
      _changeMode()
    }
  }

  function _changeMode() {
    scaleSource.modulateAll(
      {
        key: nthDegreeTone(scaleSource.conf.key, randomItemFromArray(['4', '5', '6'])),
        pref: randomItemFromArray(['omit25', 'omit27', 'omit47', 'major']),
      },
      2
    )
  }

  function checkNextShift(...commands: GridDirection[]) {
    const shift = commands.reduce((_, command) => scenes.moveInDirection(command), {} as SceneShiftInfo)
    fadeInNextTheme(shift)
    if (scaleSource.inModulation || scenes.current.isOnEdge) {
      _changeMode()
    }
  }

  function fadeInNextTheme({ makeScene, sceneAlignment, direction }: SceneShiftInfo) {
    const scene = makeScene!(scaleSource, sceneAlignment)
    const result = state.applyScene(scene)
    handleFade(result, direction)
  }

  return {
    applyInitialScene,
    checkNextShift,
    moveToDest,
    changeMode: () => {
      if (scaleSource.inModulation) return
      _changeMode()
    },
    get currentPosition() {
      return scenes.current
    },
    get config() {
      return {
        bpm: 100,
        interval: '8m',
        // -> 16 seconds interval
      }
    },
  }
}
