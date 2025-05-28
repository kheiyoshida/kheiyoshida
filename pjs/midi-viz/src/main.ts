import { main as sample } from './pjs/sample'
import { main as pj1 } from './pjs/1'

const pjs: Record<string, () => Promise<void>> = {
  sample,
  pj1
}

// pjs['pj1']()
pjs['sample']()
