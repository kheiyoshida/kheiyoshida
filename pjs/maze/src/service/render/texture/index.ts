import { makeColorManager } from '../color'
import { Colors } from '../color/colors'
import { makeSkinManager } from './skin'

export const SkinColorManager = makeColorManager(Colors.gray)

export const SkinManager = makeSkinManager(SkinColorManager)
