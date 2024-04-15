import { LR } from '../utils/types'
import { closeMapEvent, goDownstairsEvent, openMapEvent, turnEvent, walkEvent } from './events'
import * as validaters from './translate/validaters'

export const go = () => {
  if (!validaters.isAccepting()) return
  if (validaters.canGo()) {
    walkEvent()
    if (validaters.shouldGoDownstairs()) {
      goDownstairsEvent()
    }
  }
}

const turn = (dir: LR) => () => {
  if (!validaters.isAccepting()) return
  turnEvent(dir)
}

export const turnRight = turn('right')
export const turnLeft = turn('left')

export const callMap = () => {
  if (!validaters.isAccepting()) return
  if (validaters.canOpenMap()) {
    openMapEvent()
  } else {
    closeMapEvent()
  }
}
