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

const turn = (dir: 'r' | 'l') => () => {
  if (!validaters.isAccepting()) return
  turnEvent(dir)
}

export const turnRight = turn('r')
export const turnLeft = turn('l')

export const callMap = () => {
  if (!validaters.isAccepting()) return
  if (validaters.canOpenMap()) {
    openMapEvent()
  } else {
    closeMapEvent()
  }
}
