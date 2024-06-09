import { createSceneGrid, injectThemeAlignment } from 'mgnr-tone'
import * as cp from './components'

export type Character = 'dark' | 'neutral' | 'bright'

const top = (character: Character) => injectThemeAlignment({
  top: cp.freeformSynth(character),
  center: cp.movingPad(character),
  bottom: cp.longBass
})

const middle = (character: Character) => injectThemeAlignment({
  top: cp.defaultSynth(character),
  center: cp.longPad(character),
  bottom: cp.defaultDrums(character),
})

const bottom = (character: Character) => injectThemeAlignment({
  top: character === 'dark' ? cp.longPad(character) : cp.movingPad(character),
  center: cp.defaultBass(character),
  bottom: cp.dnbDrums(character)
})

export const themeGrid = createSceneGrid({
  // top
  'left-top': top('dark'),
  'center-top': top('neutral'),
  'right-top': top('bright'),

  // middle
  'left-middle': middle('dark'),
  'center-middle': top('neutral'),
  'right-middle': middle('bright'),

  // bottom
  'left-bottom': bottom('dark'),
  'center-bottom': bottom('neutral'),
  'right-bottom': bottom('bright'),
})
