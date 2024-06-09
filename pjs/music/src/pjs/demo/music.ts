import {
  Theme,
  ThemeGrid,
  ThemeGridDirection,
  ThemeShiftInfo,
  createScaleSource,
  getMixer,
  makeFadeInTheme,
  makeFadeOutTheme,
} from 'mgnr-tone'
import * as Tone from 'tone'
import { randomItemFromArray } from 'utils'

export const createCommandBuffer = (initialCommands: ThemeGridDirection[] = []) => {
  let commands: ThemeGridDirection[] = initialCommands
  return {
    get command(): ThemeGridDirection | null {
      return commands.shift() || null
    },
    push(value: ThemeGridDirection) {
      commands.push(value)
    },
    set(value: ThemeGridDirection) {
      commands = [value]
    },
  }
}

export const createMusic = (themeGrid: ThemeGrid) => {
  let currentTheme: Theme
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

  function checkNextTheme(command: ThemeGridDirection | null) {
    if (!command) return
    const shift = themeGrid.move(command)
    // console.log('shift', shift)
    applyNextTheme(shift)
  }

  function applyNextTheme(shift: ThemeShiftInfo) {
    if (shift.theme !== null) {
      fadeOutPreviousTheme(shift.direction)
      fadeInNextTheme(shift)
    } else {
      applyThemeAlignment(shift.direction)
    }
  }

  const fadeOutTheme = makeFadeOutTheme()

  function fadeOutPreviousTheme(direction: ThemeGridDirection) {
    fadeOutTheme(currentTheme, direction)
  }

  const fadeInTheme = makeFadeInTheme()
  function fadeInNextTheme({ theme, themeAlignment, direction }: ThemeShiftInfo) {
    currentTheme = theme!(getNextBar(), scale, themeAlignment, sendTrack)
    fadeInTheme(currentTheme, direction)
  }

  function applyThemeAlignment(direction: ThemeGridDirection) {
    currentTheme.updateAlignment(direction)
  }

  return {
    applyInitialTheme,
    checkNextTheme,
  }
}