/**
 * processes to run at a time, each process defines the next processes to run
 */
export interface Chain {
  /**
   * start the chain processing, it automatically runs one after another
   * @returns
   */
  start: () => void
  /**
   * change interval.
   * @param newInt
   * @returns
   */
  changeInterval: (newInt: number) => void
}

/**
 * individual chain process. it can return the next chain processes
 * it should be nullary, so pass variables to the next process
 * by calling `MakeChainProcess` if necessary
 */
export type ChainProcess = () => (ChainProcess | null)[]

/**
 * function generator that's called during consuming a process.
 * By passing variables to the next process, it can inherit the state
 */
export type MakeChainProcess = (...args: any[]) => ChainProcess

/**
 * create a chain execution manager.
 * @param initialProcesses initial processes to run. called immediately after start
 * @param initialInterval interval in ms, that can be modified
 * @param beforeEach
 * @param afterEach
 * @returns
 */
export const makeChain = (
  initialProcesses: ChainProcess[],
  initialInterval: number,
  onEnded?: () => ChainProcess[],
  beforeEach = () => {},
  afterEach = () => {},
): Chain => {
  let interval = initialInterval
  const chainLoop = (processes = initialProcesses) => {
    beforeEach()
    const nextChain = runProcesses(processes)
    if (nextChain.length) {
      setTimeout(() => {
        chainLoop(nextChain)
      }, interval)
    } else if (onEnded) {
      setTimeout(() => {
        chainLoop(onEnded())
      }, interval)
    }
    afterEach()
  }
  return {
    changeInterval: (newInt: number) => {
      interval = newInt
    },
    start: chainLoop,
  }
}

const runProcesses = (chain: ChainProcess[]): ChainProcess[] =>
  chain.flatMap(runProcess)

const runProcess = (process: ChainProcess): ChainProcess[] =>
  process().filter((f): f is ChainProcess => f !== null)
