
import { makeSoundEffectPack } from '.'

const SE = makeSoundEffectPack()

const walkBtn = document.getElementById('walk')!
const stairBtn = document.getElementById('warp')!
const liftBtn = document.getElementById('lift')!

walkBtn.onclick = () => SE.playWalk()
stairBtn.onclick = () => SE.playWarp()
liftBtn.onclick = () => SE.playLift()
