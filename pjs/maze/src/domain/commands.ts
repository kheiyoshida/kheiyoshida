import { LR } from "src/utils/direction"
import { closeMapEvent, goDownstairsEvent, openMapEvent, turnEvent, walkEvent } from './events'
import * as validaters from './validaters.ts'

export const go = () => {
  if (!validaters.isAcceptingControl()) return
  if (validaters.canGo()) {
    walkEvent()
    if (validaters.shouldGoDownstairs()) {
      goDownstairsEvent()
    }
  }
}

const turn = (dir: LR) => () => {
  if (!validaters.isAcceptingControl()) return
  turnEvent(dir)
}

export const turnRight = turn('right')
export const turnLeft = turn('left')

export const callMap = () => {
  if (!validaters.isAcceptingControl()) return
  if (validaters.canOpenMap()) {
    openMapEvent()
  } else {
    closeMapEvent()
  }
}
