import { MaxOffsetDelta, OffsetDelta, RevertStateFrames } from './constants.ts'

export const makeButtonState = () => {
  let offset: number = 0

  const addOffset = () => {
    offset = Math.min(offset + OffsetDelta, MaxOffsetDelta)
  }
  const subOffset = () => {
    offset = Math.max(offset - OffsetDelta / RevertStateFrames, 0)
  }

  return {
    get currentOffset() {
      subOffset() // reduce every time value is used
      return offset
    },
    addOffset: addOffset,
  }
}
