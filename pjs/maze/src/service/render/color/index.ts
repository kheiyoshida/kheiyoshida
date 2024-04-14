import { ColorOperationParams, ColorOperationPattern } from '../../../domain/translate/color/types'
import { OperationMap } from './operations'
import { ColorPalette, applyPalette, getPalette, setPalette } from './palette'

interface ColorManager {
  resolve: (params: ColorOperationParams) => void
  setFixedOperation: (operationParams: ColorOperationParams, ttl: number) => void
}

export const createColorManager = (): ColorManager => {
  let fixedOp: ColorOperationParams | null = null
  let fixedOpTTL = 0
  return {
    resolve([pattern, ...args]) {
      const palette = getPalette()
      if (fixedOp) {
        const [op, ...params] = fixedOp
        resolveOperation(palette, op, params)
        fixedOpTTL--
        if (fixedOpTTL <= 0) {
          if (fixedOp[0] === 'fadeout') {
            fixedOp[0] = 'default' // always return to default after fadeout
          } else {
            fixedOp = null
          }
        }
      } else {
        resolveOperation(palette, pattern, args)
      }
    },
    setFixedOperation(operation, ttl) {
      fixedOp = operation
      fixedOpTTL = ttl
    },
  }
}

const resolveOperation = (
  palette: ColorPalette,
  operationPattern: ColorOperationPattern,
  params: number[]
): void => {
  const operation = OperationMap[operationPattern]
  const newPalette = operation(palette, params)
  setPalette(newPalette)
  applyPalette(newPalette)
}
