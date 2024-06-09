import {
  Scene,
  SceneGrid,
  GridDirection,
  SceneShiftInfo,
  createScaleSource,
  getMixer,
  makeFadeInTheme,
  makeFadeOutTheme,
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

export const createMusic = (themeGrid: SceneGrid) => {
  let currentTheme: Scene
  const scale = createScaleSource({
    key: randomItemFromArray(['A', 'D', 'B']),
    range: { min: 20, max: 100 },
    pref: randomItemFromArray(['omit25', 'omit27', 'omit47']),
  })

  const sendTrack = getMixer().createSendChannel({
    effects: [
      // new Tone.Reverb(0.5), 
      new Tone.Filter(8000, 'lowpass')],
  })
  const getNextBar = () => Tone.Transport.toSeconds('@4m')

  function applyInitialTheme() {
    const theme = themeGrid.getInitialTheme()
    // currentTheme = theme(0, scale, 'center-middle', sendTrack)
    // currentTheme.top.fadeIn('1m')
    // currentTheme.bottom.fadeIn('1m')
    // currentTheme.left.fadeIn('1m')
    // currentTheme.right.fadeIn('1m')
    // currentTheme.center.fadeIn('1m')

    currentTheme = theme(getNextBar(), scale, 'center-middle', sendTrack)
    Tone.Transport.scheduleOnce(() => {
      currentTheme.top.fadeIn('4m')
      currentTheme.bottom.fadeIn('4m')
      currentTheme.left.fadeIn('4m')
      currentTheme.right.fadeIn('4m')
      currentTheme.center.fadeIn('4m')
    }, '@4m')
  }

  function checkNextTheme(command: GridDirection | null) {
    if (!command) return
    const shift = themeGrid.move(command)
    console.log('shift', shift)
    applyNextTheme(shift)
  }

  function applyNextTheme(shift: SceneShiftInfo) {
    if (shift.theme !== null) {
      fadeOutPreviousTheme(shift.direction)
      fadeInNextTheme(shift)
    } else {
      applyThemeAlignment(shift.direction)
    }
  }

  const fadeOutTheme = makeFadeOutTheme()

  function fadeOutPreviousTheme(direction: GridDirection) {
    fadeOutTheme(currentTheme, direction)
  }

  const fadeInTheme = makeFadeInTheme()
  function fadeInNextTheme({ theme, themeAlignment, direction }: SceneShiftInfo) {
    currentTheme = theme!(getNextBar(), scale, themeAlignment, sendTrack)
    fadeInTheme(currentTheme, direction)
  }

  function applyThemeAlignment(direction: GridDirection) {
    currentTheme.updateAlignment(direction)
  }

  return {
    applyInitialTheme,
    checkNextTheme,
  }
}
