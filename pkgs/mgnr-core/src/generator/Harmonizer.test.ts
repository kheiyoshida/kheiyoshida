import { Harmonizer, harmonize } from './Harmonizer'
import { Scale } from './scale/Scale'

describe(`${harmonize.name}`, () => {
  it(`can harmonize note by degree`, () => {
    const scale = new Scale({})
    const note = {
      pitch: 60,
      dur: 1,
      vel: 100,
    }
    const res = harmonize(note, scale.wholePitches, {
      degree: ['5'],
      force: false,
      lookDown: false,
    })
    expect(res).toMatchObject([
      {
        ...note,
        pitch: 67,
      },
    ])
  })
  it(`can adjust degree if there's none matching in the scale`, () => {
    const scale = new Scale({})
    const harmonizer = new Harmonizer({
      degree: ['b5'],
    })
    const note = {
      pitch: 60,
      dur: 1,
      vel: 100,
    }
    const res = harmonizer.harmonize(note, scale.wholePitches)
    expect(res).toMatchObject([
      {
        ...note,
        pitch: 67,
      },
    ])
  })
  it(`can force picking Nth degree note`, () => {
    const scale = new Scale({})
    const harmonizer = new Harmonizer({
      degree: ['b5'],
      force: true,
    })
    const note = {
      pitch: 60,
      dur: 1,
      vel: 100,
    }
    const res = harmonizer.harmonize(note, scale.wholePitches)
    expect(res).toMatchObject([{ ...note, pitch: 66 }])
  })
  it(`can look down the scale for the Nth degree note`, () => {
    const scale = new Scale({})
    const harmonizer = new Harmonizer({
      degree: ['5'],
      lookDown: true,
    })
    const note = {
      pitch: 60,
      dur: 1,
      vel: 100,
    }
    const res = harmonizer.harmonize(note, scale.wholePitches)
    expect(res).toMatchObject([{ ...note, pitch: 53 }])
  })
})
