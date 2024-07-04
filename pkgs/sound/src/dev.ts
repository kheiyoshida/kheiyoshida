
import { makeSoundEffectPack } from '.'

const SE = makeSoundEffectPack()

const walkBtn = document.getElementById('walk')!
const stairBtn = document.getElementById('stair')!

walkBtn.onclick = () => SE.playWalk()
stairBtn.onclick = () => SE.playStairs()
