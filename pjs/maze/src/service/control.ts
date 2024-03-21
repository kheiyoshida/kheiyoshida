import { MobileWidth, wh, ww } from '../config'
import * as commands from './commands'
import { renderGUI } from './interface/gui'

export const bindControl = () => {
  if (ww < MobileWidth) smallScreen()
  else wideScreen()
}

const smallScreen = () => {
  const { map, up, right, left } = renderGUI(ww, wh)
  map.touchStarted(commands.callMap)
  up.touchStarted(commands.go)
  right.touchStarted(commands.turnRight)
  left.touchStarted(commands.turnLeft)
}

const wideScreen = () => {
  const keyCodeMap = {
    [p2d.UP_ARROW]: commands.go,
    [p2d.RIGHT_ARROW]: commands.turnRight,
    [p2d.LEFT_ARROW]: commands.turnLeft,
    [p2d.DOWN_ARROW]: commands.callMap,
    [p2d.ENTER]: commands.callMap,
  } as const
  const keyMap = {
    m: commands.callMap,
    w: commands.go,
    a: commands.turnLeft,
    s: commands.callMap,
    d: commands.turnRight,
  } as const
  p2d.keyPressed = () => {
    if (p2d.keyCode in keyCodeMap) {
      keyCodeMap[p2d.keyCode]()
    }
    if (p2d.key in keyMap) {
      keyMap[p2d.key as keyof typeof keyMap]()
    }
  }
}
