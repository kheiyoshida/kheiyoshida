import { MOBILE_WIDTH } from '../constants'

export const showInstruction = (onConfirm: () => void) => {
  const div = p.createDiv()
  div.style('text-align', 'center')
  div.style('color', p.color(200))
  div.style('width', '100vw')
  div.style('height', '100vh')
  div.position(0, 0)
  div.style('background-color', p.color(0, 0, 0, 100))
  div.mouseClicked(() => {
    onConfirm()
    p.removeElements()
  })
  div.style('line-height', '1.8em')
  div.style('padding-top', '30vh')

  const text = p.createDiv(`[mgnr-demo]`)
  const text2 = p.createDiv(``)
  const text3 = p.createDiv(``)
  const text4 = p.createDiv(
    window.innerWidth < MOBILE_WIDTH
      ? `CONTROL: Swipe up/down to move, swipe right/left to turn, tap to look`
      : `CONTROL: Arrow key or WASD to move, use mouse to turn, click to look`
  )
  div.elt.appendChild(text.elt)
  div.elt.appendChild(text2.elt)
  div.elt.appendChild(text3.elt)
  div.elt.appendChild(text4.elt)
}
