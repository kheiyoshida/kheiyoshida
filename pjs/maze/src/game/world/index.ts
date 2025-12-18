import { WorldState } from './state.ts'
import { Atmosphere, StructureContext, World } from './types.ts'
import { debugRenderingMode } from '../../config/debug.ts'
import { getAtmosphere } from './atmosphere.ts'

export class WorldProvider {
  public state: WorldState = new WorldState()

  public history: World[] = []

  public constructor() {
    this.generateWorld(0)
  }

  private get numOfRepeatedStructure(): number {
    let count = 0;
    for (let i = this.history.length - 1; i > 0; i--) {
      if (this.history[i].structure === this.history[i - 1].structure) count++;
      else return count;
    }
    return count
  }

  private getDelta(level: number): number {
    return 0.1 + Math.sin(level) * 0.05
  }

  /**
   * generate world context for a level,
   * making sure current & next worlds are available
   * @param level starts from 1
   */
  public generateWorld(level: number): void {
    if (this.history.length >= level + 1) return;

    const delta = this.getDelta(level)
    if (this.numOfRepeatedStructure >= 3) {
      this.state.update(delta, this.history[this.history.length - 1].structure)
    } else {
      this.state.update(delta)
    }

    const nextWorld: World = {
      ambience: this.state.ambience,
      atmosphere: debugRenderingMode ? debugRenderingMode : getAtmosphere(level),
      structure: this.state.structure,
    }
    this.history.push(nextWorld)
  }

  public getWorld(level: number): World {
    return this.history[level - 1]
  }

  public getStructureContext(level: number): StructureContext {
    return {
      prev: this.history[level - 2]?.structure,
      current: this.history[level - 1].structure,
      next: this.history[level].structure,
    }
  }
}
