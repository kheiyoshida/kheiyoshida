import robotoFont from './Roboto/Roboto-Black.ttf'

export async function loadFont() {
  p.loadFont(robotoFont, (font) => {
    p.textFont(font)
    p.textSize(80)
  })
}
