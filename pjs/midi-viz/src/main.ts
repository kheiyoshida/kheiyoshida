import { main as sample } from './pjs/sample'
import { main as pj1 } from './pjs/1'
import { main as pj3 } from './pjs/3'

const pjs: Record<string, () => Promise<void>> = {
  sample,
  pj1,
  pj3,
}

// pjs['pj1']()
pjs['pj3']()
// pjs['sample']()
