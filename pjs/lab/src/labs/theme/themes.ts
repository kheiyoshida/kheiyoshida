import { ThemeMaker } from 'mgnr-tone'
import { prepareDrums, prepareStaticDrums, prepareStaticSynth, prepareSynth } from './components'

export const aggressiveTheme: ThemeMaker = (startAt, scale) => {
  console.log('aggressive')
  return {
    top: prepareSynth(startAt, scale),
    bottom: prepareDrums(startAt, scale),
  }
}

export const staticTheme: ThemeMaker = (startAt, scale) => {
  console.log('static')
  return {
    top: prepareStaticSynth(startAt, scale),
    bottom: prepareStaticDrums(startAt, scale),
  }
}
