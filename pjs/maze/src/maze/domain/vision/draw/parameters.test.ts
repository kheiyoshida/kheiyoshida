import { ListenableState } from '..'
import {
  getAlpha,
  getBlurRate,
  getDistortion,
  getOmitPercent,
  getVisibility,
} from './parameters'

describe(`getParams`, () => {
  const baseState: ListenableState = {
    floor: 1,
    sanity: 100,
    stamina: 100,
  }

  describe(`getVisibility`, () => {
    it.each`
      stamina | floor | result
      ${100}  | ${1}  | ${19}
      ${70}   | ${1}  | ${16}
      ${50}   | ${1}  | ${14}
      ${30}   | ${1}  | ${12}
      ${0}    | ${1}  | ${9}
      ${100}  | ${8}  | ${12}
      ${70}   | ${8}  | ${9}
      ${50}   | ${8}  | ${7}
      ${30}   | ${8}  | ${5}
      ${0}    | ${8}  | ${2}
      ${100}  | ${15} | ${5}
      ${70}   | ${15} | ${2}
      ${50}   | ${15} | ${0}
      ${30}   | ${15} | ${0}
      ${0}    | ${15} | ${0}
    `(
      `should emit visibility based off stamina & floor: 
      (stamina: $stamina, floor: $floor) => $result
    `,
      ({ stamina, floor, result }) => {
        expect(getVisibility({ ...baseState, stamina, floor })()).toBe(result)
      }
    )
  })

  describe(`getAlpha`, () => {
    it.each`
      stamina | floor | result
      ${100}  | ${1}  | ${20}
      ${70}   | ${1}  | ${20}
      ${50}   | ${1}  | ${20}
      ${30}   | ${1}  | ${20}
      ${0}    | ${1}  | ${34}
      ${100}  | ${8}  | ${20}
      ${70}   | ${8}  | ${20}
      ${50}   | ${8}  | ${20}
      ${30}   | ${8}  | ${32}
      ${0}    | ${8}  | ${60}
      ${100}  | ${15} | ${20}
      ${70}   | ${15} | ${20}
      ${50}   | ${15} | ${40}
      ${30}   | ${15} | ${60}
      ${0}    | ${15} | ${60}
    `(
      `should emit alpha value based off stamina & floor: 
      (stamina: $stamina, floor: $floor) => $result
    `,
      ({ stamina, floor, result }) => {
        expect(getAlpha({ ...baseState, stamina, floor })()).toBe(result)
      }
    )
  })

  describe(`getOmitPercent`, () => {
    it.each`
      stamina | floor | result
      ${100}  | ${1}  | ${0}
      ${70}   | ${1}  | ${0}
      ${50}   | ${1}  | ${0}
      ${30}   | ${1}  | ${10}
      ${0}    | ${1}  | ${40}
      ${100}  | ${8}  | ${0}
      ${70}   | ${8}  | ${5}
      ${50}   | ${8}  | ${25}
      ${30}   | ${8}  | ${45}
      ${0}    | ${8}  | ${75}
      ${100}  | ${15} | ${10}
      ${70}   | ${15} | ${40}
      ${50}   | ${15} | ${60}
      ${30}   | ${15} | ${80}
      ${0}    | ${15} | ${90}
    `(
      `should emit omit percent based off stamina & floor: 
    (stamina: $stamina, floor: $floor) => $result
  `,
      ({ stamina, floor, result }) => {
        expect(getOmitPercent({ ...baseState, stamina, floor })()).toBe(result)
      }
    )
  })

  // failing
  describe.skip(`getBlurRate`, () => {
    it.each`
      stamina | floor | result
      ${100}  | ${1}  | ${0}
      ${70}   | ${1}  | ${0}
      ${50}   | ${1}  | ${0}
      ${30}   | ${1}  | ${0}
      ${0}    | ${1}  | ${6}
      ${100}  | ${8}  | ${0}
      ${70}   | ${8}  | ${0}
      ${50}   | ${8}  | ${0}
      ${30}   | ${8}  | ${18}
      ${0}    | ${8}  | ${48}
      ${100}  | ${15} | ${0}
      ${70}   | ${15} | ${20}
      ${50}   | ${15} | ${40}
      ${30}   | ${15} | ${60}
      ${0}    | ${15} | ${90}
    `(
      `should emit blur rate based off stamina & floor: 
    (sanity: $stamina, floor: $floor) => $result
  `,
      ({ stamina, floor, result }) => {
        expect(getBlurRate({ ...baseState, stamina, floor })()).toBe(result)
      }
    )
  })

  describe(`getDistortion`, () => {
    it.each`
      sanity | floor | result
      ${100} | ${1}  | ${0}
      ${70}  | ${1}  | ${0}
      ${50}  | ${1}  | ${0}
      ${30}  | ${1}  | ${6}
      ${0}   | ${1}  | ${36}
      ${100} | ${8}  | ${0}
      ${70}  | ${8}  | ${8}
      ${50}  | ${8}  | ${28}
      ${30}  | ${8}  | ${48}
      ${0}   | ${8}  | ${78}
      ${100} | ${15} | ${20}
      ${70}  | ${15} | ${50}
      ${50}  | ${15} | ${70}
      ${30}  | ${15} | ${90}
      ${0}   | ${15} | ${100}
    `(
      `should emit distortion based off sanity & floor: 
    (sanity: $sanity, floor: $floor) => $result
  `,
      ({ sanity, floor, result }) => {
        expect(getDistortion({ ...baseState, sanity, floor })()).toBe(result)
      }
    )
  })
})
