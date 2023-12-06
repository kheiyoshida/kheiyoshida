import { DegreeNumList, SCALES, Semitone } from './constants'
import Logger from 'js-logger'
import { findDelete } from '../utils/utils'
import { ScaleConf } from './Scale'
import { keyDiff } from './utils'

interface ModulationQueueItem {
  add?: Semitone[]
  remove?: Semitone[]
}

export class Modulation {
  private _queue: ModulationQueueItem[]
  public get queue(): ModulationQueueItem[] {
    return this._queue
  }
  private _conf: ScaleConf
  public get conf(): ScaleConf {
    return this._conf
  }
  private _degreeList: Semitone[]
  public get degreeList(): Semitone[] {
    return this._degreeList
  }

  constructor(
    queue: ModulationQueueItem[],
    conf: ScaleConf,
    degreeList: Semitone[]
  ) {
    this._queue = queue
    this._conf = conf
    this._degreeList = degreeList
  }

  static create(
    currentConf: ScaleConf,
    nextConf: ScaleConf,
    stages: number
  ): Modulation | undefined {
    const currentDegreeList = SCALES[currentConf.pref]
    const queue = Helpers.constructModulationQueue(
      currentDegreeList,
      nextDegreeList(currentConf, nextConf),
      stages
    )
    if (!queue.length) {
      Logger.warn(
        `no changes detected: 
        ${currentConf.key}(${currentConf.pref}) and ${nextConf.key}(${nextConf.pref})`
      )
      return
    }
    return new Modulation(queue, nextConf, currentDegreeList.slice())
  }

  public next() {
    if (!this.queue.length) {
      throw new Error(`calcNextDegreeList called with empty queue`)
    }
    return this.consumeQueue()
  }

  private consumeQueue(): number[] {
    const mod = this.queue.shift()!
    if (mod.remove) {
      mod.remove.forEach((rm) => findDelete(this._degreeList, rm))
    }
    if (mod.add) {
      this._degreeList.push(...mod.add)
    }
    if (this._degreeList.length === 0) {
      Logger.info(`empty degreeList. consume another queue...`)
      return this.consumeQueue()
    }
    return this._degreeList.sort((a, b) => a - b)
  }
}

/**
 * Derive next degree list
 * (each note's degree is relative to the current key)
 */
function nextDegreeList(current: ScaleConf, next: ScaleConf): DegreeNumList {
  const diff = keyDiff(current.key, next.key)
  const dl = SCALES[next.pref]
  return slideDegreeList(dl, diff)
}

/**
 * add diff to each degree number in the list.
 * if it exceeds 12, it starts from 0 again
 */
function slideDegreeList(dl: DegreeNumList, diff: number): DegreeNumList {
  return dl.map((d) => (d + diff) % 12)
}

/**
 * Compare current and next degree list,
 * determine what to add to/remove from the current degree list
 * @param stages
 * @returns
 */
function constructModulationQueue(
  current: DegreeNumList,
  next: DegreeNumList,
  stages: number
) {
  const add = [...next.filter((d) => !current.includes(d))]
  const remove = [...current.filter((d) => !next.includes(d))]
  const totalItemsLen = add.length + remove.length
  const swapPerEvent = Math.ceil(totalItemsLen / stages)
  const actualStages = Math.ceil(totalItemsLen / swapPerEvent)

  const queue: ModulationQueueItem[] = []
  for (let i = 0; i < actualStages; i++) {
    const mod: ModulationQueueItem = {}
    let n = 0
    while (n < swapPerEvent) {
      if (remove.length) {
        const note = remove.pop()!
        if (mod.remove) {
          mod.remove.push(note)
        } else {
          mod.remove = [note]
        }
      } else if (add.length) {
        const note = add.pop()!
        if (mod.add) {
          mod.add.push(note)
        } else {
          mod.add = [note]
        }
      }
      n += 1
    }
    queue.push(mod)
  }
  return queue
}

export const Helpers = {
  constructModulationQueue,
}
