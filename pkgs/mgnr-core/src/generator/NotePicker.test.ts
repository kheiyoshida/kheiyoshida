import { NotePicker } from './NotePicker'
import { Scale } from './scale/Scale'

describe(`${NotePicker.name}`, () => {
  test(`${NotePicker.prototype.updateConfig.name}`, () => {
    const picker = new NotePicker({ noteDur: { min: 2, max: 4 } })
    picker.updateConfig({ noteDur: 2 })
    expect(picker.conf.noteDur).toBe(2)
  })

  describe(`${NotePicker.prototype.pickHarmonizedNotes.name}`, () => {
    it(`should pick harmonzied note`, () => {
      const scale = new Scale()
      const picker = new NotePicker({ harmonizer: { degree: ['5'] } }, scale)
      jest.spyOn(scale, 'pickRandomPitch').mockReturnValue(60)
      const notes = picker.pickHarmonizedNotes()
      expect(notes!.map((n) => n.pitch)).toMatchObject([60, 67])
    })
    it(`should not return anything when pickNote failed`, () => {
      const scale = new Scale()
      const picker = new NotePicker({ harmonizer: { degree: ['5'] } }, scale)
      jest.spyOn(scale, 'pickRandomPitch').mockReturnValue(undefined as unknown as number)
      expect(picker.pickHarmonizedNotes()).toBe(undefined)
    })
    it(`should return the picked note when hamonize was not enabled`, () => {
      const picker = new NotePicker()
      const res = picker.pickHarmonizedNotes()
      expect(res).toHaveLength(1)
    })
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
    it(`should pick note with concrete values if strategy is "fill"`, () => {
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

  test(`${NotePicker.prototype.harmonizeNote.name}`, () => {
    const picker = new NotePicker({ harmonizer: { degree: ['5'] } })
    const harmonized = picker.harmonizeNote({ pitch: 60, vel: 100, dur: 1 })
    expect(harmonized[0].pitch).toBe(67)
  })

  describe(`${NotePicker.prototype.adjustNotePitch.name}`, () => {
    it(`should adjust the pitch if given note is not in current scale`, () => {
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
    it(`should assign random pitch if the strategy is "fixed"`, () => {
      const picker = new NotePicker({ fillStrategy: 'fixed' })
      const note = {
        pitch: 61,
        dur: 1,
        vel: 100,
      }
      picker.adjustNotePitch(note)
      expect(note.pitch).not.toBe(61)
    })
  })
})
