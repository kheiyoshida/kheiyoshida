import { NotePicker } from './NotePicker'
import { Scale } from './Scale'

describe(`${NotePicker.name}`, () => {
  describe(`fields`, () => {
    test(`harmonizeEnabled`, () => {
      const picker = new NotePicker({ harmonizer: { degree: ['4'] } })
      expect(picker.harmonizeEnabled).toBe(true)
    })
  })

  test(`${NotePicker.prototype.updateConfig.name}`, () => {
    const picker = new NotePicker({ noteDur: {min: 2, max: 4}})    
    picker.updateConfig({noteDur: 2})
    expect(picker.conf.noteDur).toBe(2)
  })

  describe(`${NotePicker.prototype.pickNote.name}`, () => {
    it(`should pick runtime random note if strategy is "random"`, () => {
      const noteDur = { min: 2, max: 4 }
      const picker = new NotePicker({
        fillStrategy: 'random',
        noteDur,
        noteVel: 100,
      })
      const note = picker.pickNote()
      expect(note?.pitch).toBe('random')
      expect(note?.dur).toBe(noteDur)
      expect(note?.vel).toBe(100)
    })
    it(`should pick note with concrete values`, () => {
      const noteDur = { min: 2, max: 4 }
      const picker = new NotePicker({
        fillStrategy: 'fill',
        noteDur,
        noteVel: 100,
      })
      const note = picker.pickNote()
      expect(note?.pitch).not.toBe('random')
      expect(note?.dur).toBeLessThanOrEqual(noteDur.max)
      expect(note?.dur).toBeGreaterThanOrEqual(noteDur.min)
      expect(note?.vel).toBe(100)
    })
  })

  it(`${NotePicker.prototype.adjustNotePitch.name}`, () => {
    const scale = new Scale({})
    const nearest = jest.spyOn(scale, 'pickNearestPitch')
    const picker = new NotePicker({}, scale)
    picker.adjustNotePitch({
      pitch: 61,
      dur: 1,
      vel: 100,
    })
    expect(nearest).toHaveBeenCalled()
  })
})
