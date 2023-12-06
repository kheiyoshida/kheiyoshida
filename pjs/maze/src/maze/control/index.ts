import { Conf } from '../config'
import * as events from '../service/events/commands'
import * as goEvent from '../service/events/events'
import { renderGUI } from './gui'

const CONTROL_WW_THRESHOLD = 1000

export const bindControl = () => {
  goEvent.initialize()
  if (Conf.ww < CONTROL_WW_THRESHOLD) smallScreen()
  else wideScreen()
}

const smallScreen = () => {
  const { map, up, right, left } = renderGUI(Conf.ww, Conf.wh)
  map.touchStarted(events.callMap)
  up.touchStarted(events.go)
  right.touchStarted(events.turnRight)
  left.touchStarted(events.turnLeft)
}

const wideScreen = () => {
  const keyCodeMap = {
    [p.UP_ARROW]: events.go,
    [p.RIGHT_ARROW]: events.turnRight,
    [p.LEFT_ARROW]: events.turnLeft,
    [p.DOWN_ARROW]: events.callMap,
    [p.ENTER]: events.callMap,
  } as const
  const keyMap = {
    m: events.callMap,
    w: events.go,
    a: events.turnLeft,
    s: events.callMap,
    d: events.turnRight,
  } as const
  p.keyPressed = () => {
    if (p.keyCode in keyCodeMap) {
      keyCodeMap[p.keyCode]()
    }
    if (p.key in keyMap) {
      keyMap[p.key as keyof typeof keyMap]()
    }
  }
}
