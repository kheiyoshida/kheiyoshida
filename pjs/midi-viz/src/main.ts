import { main as sample } from './pjs/sample'

const pjs: Record<string, () => Promise<void>> = {
  sample
}

pjs['sample']()
