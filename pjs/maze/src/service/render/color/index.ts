import { ColorOperationParams } from '../../../domain/translate/color/types'
import { ColorOperationMap, createOperationMap } from './operations'
import { blue, green, red } from './colorUtil.ts'

export interface ColorManager {
  current: Color
  currentRGB: RGB
  resolve: (params: ColorOperationParams) => void
  setFixedOperation: (operationParams: ColorOperationParams, ttl: number) => void
  changeDefaultColor: () => void
}

export type RGB = [number, number, number]

/**
 * used to be p5.Color,
 * We use RGB for now, but we might introduce alpha in the future
 */
export type Color = RGB

export const makeColorManager = (
  defaultRGB: RGB,
  changeDefaultColor?: (rgb: RGB) => RGB,
  operationMap: ColorOperationMap = createOperationMap(defaultRGB)
): ColorManager => {
  let current: Color
  let fixedOp: ColorOperationParams | null = null
  let fixedOpTTL = 0
  const init = () => {
    current = defaultRGB
  }
  return {
    get current() {
      if (!current) init()
      return current
    },
    get currentRGB() {
      if (!current) init()
      return [red(current), green(current), blue(current)] as RGB
    },
    resolve([pattern, ...args]) {
      if (!current) {
        init()
      }
      if (fixedOp === null) {
        current = operationMap[pattern](current, args)
      } else {
        const [op, ...params] = fixedOp
        current = operationMap[op](current, params)
        fixedOpTTL--
        if (fixedOpTTL <= 0) {
          if (fixedOp[0] === 'fadeout') {
            fixedOp[0] = 'default' // always return to default after fadeout
          } else {
            fixedOp = null
          }
        }
      }
    },
    setFixedOperation(operation, ttl) {
      fixedOp = operation
      fixedOpTTL = ttl
    },
    changeDefaultColor() {
      if (changeDefaultColor) {
        defaultRGB = changeDefaultColor(defaultRGB)
        operationMap = createOperationMap(defaultRGB)
      }
    },
  }
}
