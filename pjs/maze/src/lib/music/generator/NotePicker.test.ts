import { NotePicker } from "./NotePicker"
import { Scale } from "./Scale"

describe(`NotePicker`, () => {
  it(`adjustNotePitch`, () => {
    const scale = new Scale({})
    const nearest = jest.spyOn(scale, 'pickNearestPitch')
    const picker = new NotePicker({}, scale)
    picker.adjustNotePitch({
      pitch: 61,
      dur: 1,
      vel: 100
    })
    expect(nearest).toHaveBeenCalled()
  })

  describe(`harmonize`, () => {
    it(`can harmonize note by degree`, () => {
      const scale = new Scale({})
      const picker = new NotePicker({
        harmonizer: {
          degree: ['5']
        }
      }, scale)
      const note = {
        pitch: 60,
        dur: 1,
        vel: 100
      }
      const res = picker.harmonize(note)
      expect(res).toMatchObject([{
        ...note,
        pitch: 67,
      }])
    })
    it(`can adjust degree if there's none matching in the scale`, () => {
      const scale = new Scale({})
      const picker = new NotePicker({
        harmonizer: {
          degree: ['b5']
        }
      }, scale)
      const note = {
        pitch: 60,
        dur: 1,
        vel: 100
      }
      const res = picker.harmonize(note)
      expect(res).toMatchObject([{
        ...note,
        pitch: 67,
      }])
    })
    it(`can force picking Nth degree note`, () => {
      const scale = new Scale({})
      const picker = new NotePicker({
        harmonizer: {
          degree: ['b5'],
          force: true,
        }
      }, scale)
      const note = {
        pitch: 60,
        dur: 1,
        vel: 100
      }
      const res = picker.harmonize(note)
      expect(res).toMatchObject([{...note, pitch: 66}])
    })
    it(`can look down the scale for the Nth degree note`, () => {
      const scale = new Scale({})
      const picker = new NotePicker({
        harmonizer: {
          degree: ['5'],
          lookDown: true
        }
      }, scale)
      const note = {
        pitch: 60,
        dur: 1,
        vel: 100
      }
      const res = picker.harmonize(note)
      expect(res).toMatchObject([{...note, pitch: 53}])
    })
  })
})
