import {
  GridDirection,
  SceneGrid,
  SceneShiftInfo,
  createMusicState,
  createOutlet,
  createScaleSource,
  getMixer,
  pickRandomPitchName,
} from 'mgnr-tone'
import { ToneOutlet } from 'mgnr-tone/src/Outlet'
import { InstChannel } from 'mgnr-tone/src/mixer/Channel'
import { makeFader } from 'mgnr-tone/src/theme/fade'
import * as Tone from 'tone'
import { randomItemFromArray } from 'utils'
import * as instruments from './components/instruments'
import { AvailableOutlets } from './scenes'
import { createDefaultTheme } from './theme'

export const createCommandBuffer = (initialCommands: GridDirection[] = []) => {
  let commands: GridDirection[] = initialCommands
  return {
    get command(): GridDirection | null {
      return commands.shift() || null
    },
    push(value: GridDirection) {
      commands.push(value)
    },
    set(value: GridDirection) {
      commands = [value]
    },
  }
}

export const createMusic = (sceneGrid: SceneGrid) => {
  const { channels, scaleSource, outlets } = createDefaultTheme()
  const handlefade = makeFader(channels)

  const state = createMusicState(outlets)

  function applyInitialTheme() {
    const makeScene = sceneGrid.getInitialScene()
    const scene = makeScene(scaleSource, 'center-middle')
    const result = state.applyScene(scene, Tone.Transport.toSeconds('@4m'))
    Object.values(result.in).forEach((outlet) => {
      const ch = channels[outlet as AvailableOutlets]
      if (!ch) throw Error(`channel not found: ${outlet}`)
      ch.dynamicVolumeFade(ch.volumeRangeDiff, '4m')
    })
  }

  function checkNextShift(command: GridDirection | null) {
    if (!command) return
    scaleSource.modulateAll({ key: pickRandomPitchName() }, 4)
    const shift = sceneGrid.move(command)
    fadeInNextTheme(shift)
  }

  function fadeInNextTheme({ makeScene, sceneAlignment, direction }: SceneShiftInfo) {
    const scene = makeScene!(scaleSource, sceneAlignment)
    const result = state.applyScene(scene)
    handlefade(result, direction)
  }

  return {
    applyInitialTheme,
    checkNextShift,
  }
}
