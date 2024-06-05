import {
  Scale,
  Theme,
  ThemeAlignment,
  ThemeGrid,
  ThemeGridDirection,
  ThemeShiftInfo,
} from 'mgnr-tone'
import * as Tone from 'tone'

export const createCommandBuffer = () => {
  const commands: ThemeGridDirection[] = [
    'down',
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

  function fadeOutPreviousTheme(direction: ThemeGridDirection) {
    const { top, bottom } = currentTheme
    Tone.Transport.scheduleOnce((t) => {
      Tone.Transport.scheduleOnce(
        () => {
          if (direction === 'up') {
            top.fadeOut('16m')
            bottom.fadeOut('8m')
          } else {
            top.fadeOut('8m')
            bottom.fadeOut('16m')
          }
        },
        t + Tone.Transport.toSeconds('4m')
      )
    }, '@4m')
  }

  function fadeInNextTheme({ theme, themeAlignment, direction }: ThemeShiftInfo) {
    currentTheme = theme!(getNextBar(), scale, themeAlignment)
    Tone.Transport.scheduleOnce((t) => {
      Tone.Transport.scheduleOnce(
        () => {
          if (direction === 'up') {
            currentTheme.top.fadeIn('16m')
          } else {
            currentTheme.bottom.fadeIn('16m')
          }
        },
        t + Tone.Transport.toSeconds('4m')
      )
      if (direction === 'up') {
        currentTheme.bottom.fadeIn('8m')
      } else {
        currentTheme.top.fadeIn('8m')
      }
    }, '@4m')
  }

  function applyThemeAlignment(direction: ThemeGridDirection) {
    currentTheme.updateAlignment(direction)
  }

  return {
    applyInitialTheme,
    checkNextTheme,
  }
}
