import { randomIntInclusiveBetween } from 'utils'
import { makeColorManager } from '../color'
import { Colors } from '../color/colors'
import { makeSkinManager } from './skin'

export const SkinColorManager = makeColorManager(Colors.gray, ([r, g, b]) => {
  return [
    Math.max(50, r + randomIntInclusiveBetween(-20, 20)),
    Math.max(50, g + randomIntInclusiveBetween(-20, 20)),
    Math.max(50, b + randomIntInclusiveBetween(-20, 20)),
  ]
})

export const SkinManager = makeSkinManager(SkinColorManager)
