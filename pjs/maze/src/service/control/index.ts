import { MobileWidth, wh, ww } from '../../config'
import * as commands from './commands'
import { renderGUI } from './gui'

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
