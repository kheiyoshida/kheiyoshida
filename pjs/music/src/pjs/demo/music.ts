import {
  GridDirection,
  SceneGrid,
  SceneShiftInfo,
  createMusicState,
  createOutlet,
  createScaleSource,
  getMixer,
} from 'mgnr-tone'
import { ToneOutlet } from 'mgnr-tone/src/Outlet'
import { InstChannel } from 'mgnr-tone/src/mixer/Channel'
import { makeFader } from 'mgnr-tone/src/theme/fade'
import * as Tone from 'tone'
import { randomItemFromArray } from 'utils'
import * as instruments from './components/instruments'
import { AvailableOutlets } from './themes'

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
    effects: [new Tone.Reverb(0.5), new Tone.Filter(8000, 'lowpass')],
  })

  const mixer = getMixer()

  // theme
  const synCh = mixer.createInstChannel({
    inst: instruments.brightLead(),
    effects: [new Tone.PingPongDelay(0.3)],
    initialVolume: -40,
    volumeRange: {
      max: -20,
      min: -40,
    },
  })
  const padCh = mixer.createInstChannel({
    inst: instruments.darkPad(),
    initialVolume: -40,
    effects: [new Tone.Filter(300, 'highpass'), new Tone.PingPongDelay(0.2)],
  })
  const bassCh = mixer.createInstChannel({
    inst: instruments.darkBass(),
    initialVolume: -40,
    volumeRange: {
      max: -20,
      min: -40,
    },
  })
  const drumsCh = mixer.createInstChannel({
    inst: instruments.beatDrums(),
    initialVolume: -40,
  })

  mixer.connect(synCh, sendTrack, 0.2)
  mixer.connect(padCh, sendTrack, 0.5)
  mixer.connect(drumsCh, sendTrack, 0.2)

  const channels: Record<AvailableOutlets, InstChannel> = {
    synth: synCh,
    pad: padCh,
    drums: drumsCh,
    bass: bassCh,
  }
  const handlefade = makeFader(channels)

  const outlets: Record<AvailableOutlets, ToneOutlet> = {
    synth: createOutlet(synCh.inst, Tone.Transport.toSeconds('16n')),
    pad: createOutlet(padCh.inst),
    drums: createOutlet(drumsCh.inst, Tone.Transport.toSeconds('16n')),
    bass: createOutlet(bassCh.inst, Tone.Transport.toSeconds('16n')),
  }

  const state = createMusicState(outlets)

  function applyInitialTheme() {
    const makeScene = sceneGrid.getInitialScene()
    const scene = makeScene(scale, 'center-middle')
    const result = state.applyScene(scene, Tone.Transport.toSeconds('@4m'))
    handlefade(result, 'up')
  }

  function checkNextTheme(command: GridDirection | null) {
    if (!command) return
    const shift = sceneGrid.move(command)
    console.log('shift', shift)
    console.log(state.active)
    console.log(state.active.left!.ports.map(p => p.numOfLoops))
    applyNextTheme(shift)
  }

  function applyNextTheme(shift: SceneShiftInfo) {
    if (shift.makeScene !== null) {
      fadeOutPreviousTheme(shift.direction)
      fadeInNextTheme(shift)
    } else {
      applyThemeAlignment(shift.direction)
    }
  }

  function fadeOutPreviousTheme(direction: GridDirection) {
    // fadeOutTheme(currentTheme, direction)
  }

  function fadeInNextTheme({ makeScene, sceneAlignment, direction }: SceneShiftInfo) {
    const scene = makeScene!(scale, sceneAlignment)
    const result = state.applyScene(scene)
    handlefade(result, direction)
  }

  function applyThemeAlignment(direction: GridDirection) {
    // currentTheme.updateAlignment(direction)
  }

  return {
    applyInitialTheme,
    checkNextTheme,
  }
}
