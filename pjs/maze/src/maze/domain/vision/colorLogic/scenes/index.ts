import { ListenableState } from "../.."
import { floorToThreshold } from "../../../stats"
import { parameterizeNormalScene } from "./default"
import { parameterizeEffectScene } from "./effect"
import { ColorIntention, Scene } from "./types"

export const domainColorLogic = (state: ListenableState) => {
  const [mid, low] = floorToThreshold(state.floor)
  if (state.sanity >= mid)
    return [Scene.Normal, parameterizeNormalScene(state)] as ColorIntention<Scene.Normal>
  else if (state.sanity >= low)
    return [Scene.Effect, parameterizeEffectScene(state)] as ColorIntention<Scene.Effect>
  else return [Scene.Effect, parameterizeEffectScene(state)] as ColorIntention<Scene.Effect>
}