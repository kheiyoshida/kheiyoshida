import { Conf } from '../../config'
import * as commands from './commands'
import { renderGUI } from './gui'

const CONTROL_WW_THRESHOLD = 1000

export const bindControl = () => {
  if (Conf.ww < CONTROL_WW_THRESHOLD) smallScreen()
  else wideScreen()
}

const smallScreen = () => {
  const { map, up, right, left } = renderGUI(Conf.ww, Conf.wh)
  map.touchStarted(commands.callMap)
  up.touchStarted(commands.go)
  right.touchStarted(commands.turnRight)
  left.touchStarted(commands.turnLeft)
}

const wideScreen = () => {
  const keyCodeMap = {
    [p.UP_ARROW]: commands.go,
    [p.RIGHT_ARROW]: commands.turnRight,
    [p.LEFT_ARROW]: commands.turnLeft,
    [p.DOWN_ARROW]: commands.callMap,
    [p.ENTER]: commands.callMap,
  } as const
  const keyMap = {
    m: commands.callMap,
    w: commands.go,
    a: commands.turnLeft,
    s: commands.callMap,
    d: commands.turnRight,
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
