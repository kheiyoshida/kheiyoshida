import { createThemeGrid, injectThemeAlignment } from 'mgnr-tone'
import * as cp from './components'

const devTheme = injectThemeAlignment({
  center: cp.samplePad
})

const aggressiveTheme = injectThemeAlignment({
  top: cp.darkPadSynth,
  bottom: cp.prepareDrums,
})

const staticTheme = injectThemeAlignment({
  top: cp.harmonisedPad,
  bottom: cp.prepareStaticDrums,
})

const ambientTheme = injectThemeAlignment({
  // top: cp.nuancePad,
  // left: cp.prepareWonderBassTrack,
  bottom: cp.prepareDrums
})

export const themeGrid = createThemeGrid({
  // top
  'left-top': aggressiveTheme,
  'center-top': aggressiveTheme,
  'right-top': aggressiveTheme,

  // middle
  'left-middle': staticTheme,
  'center-middle': devTheme,
  'right-middle': staticTheme,

  // bottom
  'left-bottom': staticTheme,
  'center-bottom': staticTheme,
  'right-bottom': staticTheme,
})
