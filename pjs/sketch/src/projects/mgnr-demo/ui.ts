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
  const text2 = p.createDiv(`Click or tap to play`)
  const text3 = p.createDiv(`(*plays sound*)`)
  const text4 = p.createDiv(`Control: arrow keys/swipe`)
  div.elt.appendChild(text.elt)
  div.elt.appendChild(text2.elt)
  div.elt.appendChild(text3.elt)
  div.elt.appendChild(text4.elt)
}
