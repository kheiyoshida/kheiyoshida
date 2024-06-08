import { createThemeGrid, injectThemeAlignment } from 'mgnr-tone'
import {
  prepareDrums,
  prepareNauncePadTrack,
  prepareStaticDrums,
  prepareStaticSynth,
  prepareSynth,
  prepareWonderBassTrack
} from './components/components'

const aggressiveTheme = injectThemeAlignment({
  top: prepareSynth,
  bottom: prepareDrums,
})

const staticTheme = injectThemeAlignment({
  top: prepareStaticSynth,
  bottom: prepareStaticDrums,
})

const ambientTheme = injectThemeAlignment({
  top: prepareNauncePadTrack,
  left: prepareWonderBassTrack,
  // bottom: prepareDrums
})

export const themeGrid = createThemeGrid({
  'left-top': aggressiveTheme,
  'center-top': aggressiveTheme,
  'right-top': aggressiveTheme,
  'left-middle': staticTheme,
  'center-middle': ambientTheme,
  'right-middle': staticTheme,
  'left-bottom': staticTheme,
  'center-bottom': staticTheme,
  'right-bottom': staticTheme,
})
