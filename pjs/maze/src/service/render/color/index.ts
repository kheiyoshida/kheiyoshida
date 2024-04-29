import p5 from 'p5'
import { ColorOperationParams } from '../../../domain/translate/color/types'
import { ColorOperationMap, createOperationMap } from './operations'

export interface ColorManager {
  current: p5.Color
  currentRGB: RGB
  resolve: (params: ColorOperationParams) => void
  setFixedOperation: (operationParams: ColorOperationParams, ttl: number) => void
}

export type RGB = [number, number, number]

export const createColorManager = (
  defaultRGB: RGB,
  operationMap: ColorOperationMap = createOperationMap(defaultRGB)
): ColorManager => {
  let current: p5.Color
  let fixedOp: ColorOperationParams | null = null
  let fixedOpTTL = 0
  return {
    get current() {
      return current
    },
    get currentRGB() {
      return [p.red(current), p.green(current), p.blue(current)] as RGB
    },
    resolve([pattern, ...args]) {
      if (!current) {
        current = p.color(...defaultRGB)
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
  }
}
