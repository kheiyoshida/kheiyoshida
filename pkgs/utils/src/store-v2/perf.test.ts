/* eslint-disable @typescript-eslint/no-unused-vars */
import { makeStoreV2 } from '.'
import { comparePerformance } from '../debug'
import { deepCopy } from '../utils'

describe.skip(`performance comparision`, () => {
  type TestState = {
    state1: string
    state2: number
    state3: number[]
  }
  const objStore: TestState = {
    state1: 'foo',
    state2: 0,
    state3: [1, 2, 3],
  }

  const testStore = makeStoreV2<TestState>()({
    updateString: (s) => (val: string) => {
      s.state1 = val
    },
    updateNum: (s) => (val: number) => {
      s.state2 = val
    },
    updateConcat: (s) => (val: number) => {
      s.state3 = s.state3.concat(val)
    },
  })
  testStore.init(deepCopy(objStore))

  test.skip(`read`, () => {
    comparePerformance(
      () => {
        const s1 = objStore.state1
        const s2 = objStore.state2
        const s3 = objStore.state3
      },
      () => {
        const s1 = testStore.read('state1')
        const s2 = testStore.read('state2')
        const s3 = testStore.read('state3')
      }
    )
  })
  test(`update`, () => {
    comparePerformance(
      () => {
        objStore.state1 = `${Math.random()}`
        objStore.state2 = Math.random()
      },
      () => {
        testStore.updateString(`${Math.random()}`)
        testStore.updateNum(Math.random())
      }
    )
  })
})
