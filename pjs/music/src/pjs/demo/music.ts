import {
  GridDirection,
  Scene,
  SceneGrid,
  SceneShiftInfo,
  createMusicState,
  createOutlet,
  createScaleSource,
  getMixer,
} from 'mgnr-tone'
import * as Tone from 'tone'
import { randomItemFromArray } from 'utils'

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
  
  const scale = createScaleSource({
    key: randomItemFromArray(['A', 'D', 'B']),
    range: { min: 20, max: 100 },
    pref: randomItemFromArray(['omit25', 'omit27', 'omit47']),
  })

  const sendTrack = getMixer().createSendChannel({
    effects: [
      // new Tone.Reverb(0.5),
      new Tone.Filter(8000, 'lowpass'),
    ],
  })
  const mixer = getMixer()
  const synCh = mixer.createInstChannel({
    inst: new Tone.MonoSynth(),
  })
  mixer.connect(synCh, sendTrack, 0.2)
  const outlets = {
    synth: createOutlet(synCh.inst, Tone.Transport.toSeconds('16n'))
  }

  const state = createMusicState(outlets)

  function applyInitialTheme() {
    const scene = sceneGrid.getInitialTheme()
    const s = scene(scale, 'center-middle')
    state.applyScene(s)
  }

  function checkNextTheme(command: GridDirection | null) {
    if (!command) return
    const shift = sceneGrid.move(command)
    console.log('shift', shift)
    applyNextTheme(shift)
  }

  function applyNextTheme(shift: SceneShiftInfo) {
    if (shift.scene !== null) {
      fadeOutPreviousTheme(shift.direction)
      fadeInNextTheme(shift)
    } else {
      applyThemeAlignment(shift.direction)
    }
  }

  function fadeOutPreviousTheme(direction: GridDirection) {
    // fadeOutTheme(currentTheme, direction)
  }

  function fadeInNextTheme({ scene, sceneAlignment, direction }: SceneShiftInfo) {
    const s = scene!(scale, sceneAlignment)
    state.applyScene(s)
    // fadeInTheme(currentTheme, direction)
  }

  function applyThemeAlignment(direction: GridDirection) {
    // currentTheme.updateAlignment(direction)
  }

  return {
    applyInitialTheme,
    checkNextTheme,
  }
}
