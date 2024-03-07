import { ListenableState } from '.'

export type DrawParams = {
  visibility: number
  omitPercent: number
  farAlpha: number
  blurRate: number
  distortion: number
}

type GetCoefficient = (floor: number) => number

type GetParam = (state: ListenableState) => (threshold?: number) => number

const getCoefficientVisibility: GetCoefficient = (floor) => 100 - Math.min(floor, 15) * 10

export const getVisibility: GetParam =
  ({ floor, stamina }) =>
  (coefficient = getCoefficientVisibility(floor)) =>
    Math.max(0, Math.floor((coefficient + stamina) / 10))

const getAlphaCoefficient: GetCoefficient = (floor) => 30 + 4 * floor

export const getAlpha: GetParam =
  ({ floor, stamina }) =>
  (coefficient = getAlphaCoefficient(floor)) =>
    Math.max(Math.min(coefficient - stamina, 60), 20)

const getOmitCoefficient: GetCoefficient = (floor) => 5 + 5 * floor

export const getOmitPercent: GetParam =
  ({ floor, stamina }) =>
  (coefficient = getOmitCoefficient(floor)) =>
    Math.max(0, Math.min(90, 30 + coefficient - stamina))

const getBlurRateCoefficient: GetCoefficient = (floor) => 6 * floor

export const getBlurRate: GetParam =
  ({ floor, stamina }) =>
  (coefficient = getBlurRateCoefficient(floor)) =>
    Math.max(0, Math.min(coefficient + 30 - stamina, 1000))

const getDistortionCoefficient: GetCoefficient = (floor) => 6 * floor

export const getDistortion: GetParam =
  ({ floor, sanity }) =>
  (coefficient = getDistortionCoefficient(floor)) =>
    Math.max(0, Math.min(100, 30 + coefficient - sanity))

export const getDrawParams = (state: ListenableState): DrawParams => {
  return {
    visibility: getVisibility(state)(),
    farAlpha: getAlpha(state)(),
    omitPercent: getOmitPercent(state)(),
    blurRate: getBlurRate(state)(),
    distortion: getDistortion(state)(),
  }
}
