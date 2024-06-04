import { Scale, Theme, ThemeGrid } from 'mgnr-tone'
import * as Tone from 'tone'

export const createMusic = (themeGrid: ThemeGrid) => {
  let currentTheme: Theme
  const scale = new Scale({ range: { min: 30, max: 80 }, pref: 'omit25' })

  const getNextBar = () => Tone.Transport.toSeconds('@4m')

  return {
    applyNextTheme() {
      if (!currentTheme) {
        const makeTheme = themeGrid.getInitialTheme()
        currentTheme = makeTheme(getNextBar(), scale)
        Tone.Transport.scheduleOnce(() => {
          currentTheme.top?.fadeIn('4m')
          currentTheme.bottom?.fadeIn('4m')
        }, '@4m')
        return
      }
      const nextTheme = themeGrid.getNextTheme()
      if (!nextTheme) return

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

      currentTheme = nextTheme(getNextBar(), scale)

      Tone.Transport.scheduleOnce(() => {
        currentTheme.top?.fadeIn('12m')
        currentTheme.bottom?.fadeIn('4m')
      }, '@4m')
    },
  }
}
