import { Scale, Theme, ThemeAlignment, ThemeGrid, ThemeGridDirection, ThemeShiftInfo } from 'mgnr-tone'
import * as Tone from 'tone'

export const createCommandBuffer = () => {
  let commands: ThemeGridDirection[] = []
  return {
    get command(): ThemeGridDirection | null {
      return commands.pop() || null
    },
    set(value: ThemeGridDirection) {
      commands = [value]
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
      fadeOutPreviousTheme()
      fadeInNextTheme(shift)
    } else {
      applyThemeAlignment(shift.themeAlignment)
    }
  }

  function fadeOutPreviousTheme() {
    const { top, bottom } = currentTheme
    Tone.Transport.scheduleOnce((t) => {
      Tone.Transport.scheduleOnce(
        () => {
          top.fadeOut('12m')
        },
        t + Tone.Transport.toSeconds('4m')
      )
      Tone.Transport.scheduleOnce(
        () => {
          bottom.fadeOut('4m')
        },
        t + Tone.Transport.toSeconds('2m')
      )
    }, '@4m')
  }

  function fadeInNextTheme({theme, themeAlignment, direction}: ThemeShiftInfo) {
    currentTheme = theme!(getNextBar(), scale, themeAlignment)
    Tone.Transport.scheduleOnce(() => {
      if (direction === 'up') {
        currentTheme.top.fadeIn('12m')
        currentTheme.bottom.fadeIn('4m')
      } else {
        currentTheme.top.fadeIn('4m')
        currentTheme.bottom.fadeIn('12m')
      }
    }, '@4m')
  }

  function applyThemeAlignment(alignment: ThemeAlignment) {
    currentTheme.updateAlignment(alignment)
  }

  return {
    applyInitialTheme,
    checkNextTheme,
  }
}
