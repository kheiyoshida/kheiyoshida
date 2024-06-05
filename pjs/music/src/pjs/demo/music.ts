import {
  Scale,
  Theme,
  ThemeGrid,
  ThemeGridDirection,
  ThemeShiftInfo,
  makeFadeInTheme,
  makeFadeOutTheme,
} from 'mgnr-tone'
import * as Tone from 'tone'

export const createCommandBuffer = () => {
  const commands: ThemeGridDirection[] = [
    'up',
    'up',
    'up',
    'up',
    'up',
    'up',
    'down',
    'down',
    'down',
    'down',
    'down',
    'down',
    'down',
  ]
  return {
    get command(): ThemeGridDirection | null {
      return commands.shift() || null
    },
    set(value: ThemeGridDirection) {
      commands.push(value)
      // commands = [value]
    },
  }
}

export const createMusic = (themeGrid: ThemeGrid) => {
  let currentTheme: Theme
  const scale = new Scale({ range: { min: 30, max: 80 }, pref: 'omit25' })

  const getNextBar = () => Tone.Transport.toSeconds('@4m')

  function applyInitialTheme() {
    const theme = themeGrid.getInitialTheme()
    currentTheme = theme(getNextBar(), scale, 'center-middle')
    Tone.Transport.scheduleOnce(() => {
      currentTheme.top.fadeIn('4m')
      currentTheme.bottom.fadeIn('4m')
    }, '@4m')
  }

  function checkNextTheme(command: ThemeGridDirection | null) {
    if (!command) return
    const shift = themeGrid.move(command)
    console.log('shift', shift)
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
    currentTheme = theme!(getNextBar(), scale, themeAlignment)
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
