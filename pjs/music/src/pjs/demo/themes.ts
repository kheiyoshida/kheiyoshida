import { createThemeGrid, injectThemeAlignment } from 'mgnr-tone'
import {
  prepareDrums,
  prepareStaticDrums,
  prepareStaticSynth,
  prepareSynth,
} from './components/components'

const aggressiveTheme = injectThemeAlignment({
  top: prepareSynth,
  bottom: prepareDrums,
})

const staticTheme = injectThemeAlignment({
  top: prepareStaticSynth,
  bottom: prepareStaticDrums,
})

export const themeGrid = createThemeGrid({
  'left-top': aggressiveTheme,
  'center-top': aggressiveTheme,
  'right-top': aggressiveTheme,
  'left-middle': staticTheme,
  'center-middle': staticTheme,
  'right-middle': staticTheme,
  'left-bottom': staticTheme,
  'center-bottom': staticTheme,
  'right-bottom': staticTheme,
})
