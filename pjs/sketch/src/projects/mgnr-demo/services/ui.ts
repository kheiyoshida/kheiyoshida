import { MOBILE_WIDTH } from '../constants'

export const showInstruction = (onConfirm: () => void) => {
  const div = p.createDiv()
  div.style('color', p.color(200))
  div.style('width', '100vw')
  div.style('height', '100vh')
  div.style('padding', '1rem')
  div.position(0, 0)
  div.style('background-color', p.color(0, 0, 0, 100))
  div.mouseClicked(() => {
    onConfirm()
    p.removeElements()
  })
  div.style('line-height', '1.8em')
  div.style('padding-top', '30vh')

  const instruction = window.innerWidth < MOBILE_WIDTH ? MobileControl : PcControl

  const text = p.createDiv(`[HOW TO PLAY]`)
  const text2 = p.createDiv(instruction[0])
  const text3 = p.createDiv(instruction[1])
  const text4 = p.createDiv(instruction[2])
  div.elt.appendChild(text.elt)
  div.elt.appendChild(text2.elt)
  div.elt.appendChild(text3.elt)
  div.elt.appendChild(text4.elt)
}

const MobileControl = [
  `MOVE: Swipe up/down`,
  'TURN: Swipe right/left',
  'LOOK: Tap to enter Look Mode, swipe to look around, tap again to leave',
]

const PcControl = [
  `MOVE: Press arrow keys or WASD keys`,
  'TURN: Move cursor (mouse) from the center',
  'LOOK: Click to enter Look Mode, move cursor to look around, click again to leave',
]
