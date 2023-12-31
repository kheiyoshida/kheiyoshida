import { pushPop } from "src/lib/p5utils"
import { getStats } from "."

export const debugStats = () => {
  const {sanity, stamina} = getStats()
  pushPop(() => {
    p.textSize(32)
    p.stroke(100, 0, 200)
    p.fill(100, 0, 200)
    p.text(`SANITY: ${sanity} \nSTAMINA: ${stamina}`, 0, 200)
  })
}