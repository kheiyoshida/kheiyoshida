import { ThemeMaker, createThemeGrid } from 'mgnr-tone'
import { prepareDrums, prepareStaticDrums, prepareStaticSynth, prepareSynth } from './components/components'

export const aggressiveTheme: ThemeMaker = (startAt, scale) => {
  return {
    top: prepareSynth(startAt, scale),
    bottom: prepareDrums(startAt, scale),
  }
}

export const staticTheme: ThemeMaker = (startAt, scale) => {
  return {
    top: prepareStaticSynth(startAt, scale),
    bottom: prepareStaticDrums(startAt, scale),
  }
}

export const themeGrid = createThemeGrid({
  'center-center': staticTheme,
  'bottom-center': aggressiveTheme,
  'top-center': aggressiveTheme,
  'top-left': aggressiveTheme,
  'top-right': aggressiveTheme,
  'center-left': aggressiveTheme,
  'center-right': aggressiveTheme,
  'bottom-left': aggressiveTheme,
  'bottom-right': aggressiveTheme,
})
