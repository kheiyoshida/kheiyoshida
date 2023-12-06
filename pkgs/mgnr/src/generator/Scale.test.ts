import Logger from 'js-logger'
import { OCTAVE } from './constants'
import { Scale } from './Scale'

describe(`Scale`, () => {
  describe(`note construction`, () => {
    it(`should construct note pool from key and range`, () => {
      const scale = new Scale({
        key: 'C',
        range: { min: 60, max: 60 + OCTAVE * 3 },
      })
      expect(scale.pitches).toMatchObject([
        60, 62, 64, 65, 67, 69, 71, 72, 74, 76, 77, 79, 81, 83, 84, 86, 88, 89,
        91, 93, 95, 96,
      ])
    })

    it(`should detect error range and fallback to default`, () => {
      const l = jest.spyOn(Logger, 'warn')
      const scale = new Scale({
        key: 'C',
        range: { min: 0, max: 30 },
      })
      expect(scale.pitches).toMatchInlineSnapshot(`
        [
          24,
          26,
          28,
          29,
        ]
      `)
      expect(l).toHaveBeenCalledWith(
        'Scale.range should be between 24 - 120',
        'invalid: 0'
      )
    })

    it(`can set prefered degree in the key`, () => {
      const scale = new Scale({
        key: 'D#',
        pref: 'omit27',
        range: { min: 60, max: 90 },
      })
      expect(scale.pitches).toMatchObject([
        60, 63, 67, 68, 70, 72, 75, 79, 80, 82, 84, 87,
      ])
    })
  })

  describe('note picker', () => {
    let scale: Scale
    beforeAll(() => {
      scale = new Scale({ key: 'C', range: { min: 60, max: 80 } })
    })
    it(`should pick random note from the range`, () => {
      for (let i = 0; i < 100; i++) {
        const n = scale.pickRandom()
        expect(n! >= 60 && n! <= 80).toBe(true)
      }
    })
    it(`can pick Nth degree note of the scale`, () => {
      const res = scale.pickNthDegree('5', { min: 60, max: 72 })
      expect(res).toBe(67)
      const res2 = scale.pickNthDegree('b7', { min: 60, max: 72 })
      expect(res2).toBe(undefined)
      const res3 = scale.pickNthDegree('7', { min: 60, max: 67 })
      expect(res3).toBe(undefined)
      const res4 = scale.pickNthDegree('1')
      expect(res4).toBe(60)
      const res5 = scale.pickNthDegree(0)
      expect(res5).toBe(60)
      const res6 = scale.pickNthDegree(12)
      expect(res6).toBe(60)
    })
    it(`can pick nearest note in the scale for a note`, () => {
      const scale = new Scale({ key: 'C', pref: 'major' })
      expect(scale.pickNearestPitch(61, 'down')).toBe(60)
      expect(scale.pickNearestPitch(61, 'up')).toBe(62)
    })
  })

  describe(`modulation`, () => {
    it(`can gradually change notes to the destination scale`, () => {
      const scale = new Scale({
        key: 'C',
        pref: 'major',
        range: { min: 60, max: 72 },
      })
      expect(scale.pitches).toMatchObject([60, 62, 64, 65, 67, 69, 71, 72])
      scale.modulate({ key: 'F' }, 2)
      expect(scale.pitches).toMatchObject([60, 62, 64, 65, 67, 69, 72])
      scale.modulate()
      expect(scale.pitches).toMatchObject([60, 62, 64, 65, 67, 69, 70, 72])
      expect(scale.key).toBe('F')
      expect(scale.inModulation).toBe(false)
    })
    it(`should change notes immediately if stages < 2`, () => {
      const scale = new Scale({
        key: 'C',
        pref: 'major',
        range: { min: 60, max: 72 },
      })
      expect(scale.pitches).toMatchObject([60, 62, 64, 65, 67, 69, 71, 72])
      scale.modulate({ key: 'F' }, 1)
      expect(scale.pitches).toMatchObject([60, 62, 64, 65, 67, 69, 70, 72])
      expect(scale.key).toBe('F')
      expect(scale.inModulation).toBe(false)
    })
    it(`can change its tone range`, () => {
      const scale = new Scale({
        key: 'C',
        range: { min: 60, max: 60 + OCTAVE * 3 },
      })
      const beforeNotes = scale.pitches.slice()
      scale.modulate({ range: { min: 60, max: 60 + OCTAVE * 1 } })
      expect(scale.pitches).not.toMatchObject(beforeNotes)
      expect(scale.pitches).toMatchObject([60, 62, 64, 65, 67, 69, 71, 72])
    })
    it(`can change prefered tone`, () => {
      const scale = new Scale({
        key: 'D#',
        pref: 'omit27',
        range: { min: 60, max: 90 },
      })
      const beforeNotes = scale.pitches.slice()
      scale.modulate({ pref: 'omit47' })
      expect(scale.pitches).not.toMatchObject(beforeNotes)
      expect(scale.pitches).toMatchObject([
        60, 63, 65, 67, 70, 72, 75, 77, 79, 82, 84, 87, 89,
      ])
    })
    it(`should cancel modulation if there's no change`, () => {
      const scale = new Scale({
        key: 'C',
        pref: 'omit27',
        range: { min: 60, max: 72 },
      })
      expect(scale.pitches).toMatchObject([60, 64, 65, 67, 69, 72])
      scale.modulate({ key: 'F', pref: 'omit46' }, 3)
      expect(scale.key).toBe('F')
      expect(scale.pitches).toMatchObject([60, 64, 65, 67, 69, 72])
      expect(scale.inModulation).toBe(false)
    })
    it.todo(`should NOT cancel modulation if there's change in range`)
  })
})
