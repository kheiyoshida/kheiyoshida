import { Scale, Theme, ThemeGrid, ThemeMaker } from 'mgnr-tone'
import * as Tone from 'tone'

export const createMusic = (themeGrid: ThemeGrid) => {
  let currentTheme: Theme
  const scale = new Scale({ range: { min: 30, max: 80 }, pref: 'omit25' })

  const getNextBar = () => Tone.Transport.toSeconds('@4m')

  function applyInitialTheme() {
    const makeTheme = themeGrid.getInitialTheme()
    currentTheme = makeTheme(getNextBar(), scale)
    Tone.Transport.scheduleOnce(() => {
      currentTheme.top?.fadeIn('4m')
      currentTheme.bottom?.fadeIn('4m')
    }, '@4m')
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

  function fadeInNextTheme(nextTheme: ThemeMaker) {
    currentTheme = nextTheme(getNextBar(), scale)
    Tone.Transport.scheduleOnce(() => {
      currentTheme.top?.fadeIn('12m')
      currentTheme.bottom?.fadeIn('4m')
    }, '@4m')
  }

  function applyNextTheme(nextTheme: ThemeMaker) {
    fadeOutPreviousTheme()
    fadeInNextTheme(nextTheme)
  }

  function checkNextTheme() {
    const nextTheme = themeGrid.getNextTheme()
    if (nextTheme) {
      applyNextTheme(nextTheme)
    }
  }

  return {
    get currentTheme() {
      return currentTheme
    },
    applyInitialTheme,
    checkNextTheme,
  }
}
