import { IntRange } from "utils";
import { Randomness } from "../../scenes";

export type RandomLevel = IntRange<1, 10>

const meta: Record<Randomness, 0|3|6> = {
  static: 0,
  hybrid: 3,
  dynamic: 6
}
const scene: Record<Randomness, 1|2|3> = {
  static: 1,
  hybrid: 2,
  dynamic: 3
}

export const convertRandomLevel = (metaRandomness: Randomness, sceneRandomness: Randomness): RandomLevel => {
  return meta[metaRandomness] + scene[sceneRandomness] as RandomLevel
}
