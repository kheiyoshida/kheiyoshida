import { makeStoreV2 } from '.';

type TestState = { fieldA: string; arr: number[] }

test(`${makeStoreV2.name}`, () => {
  const store = makeStoreV2<TestState>()({
    updateField: (state) => (val: string) => {
      state.fieldA = val
    },
    pushNumber: (state) => (num: number) => {
      state.arr.push(num)
    },
    pushNumbers: (state) => (nums: number[]) => {
      state.arr = state.arr.concat(nums)
    },
  })

  store.init({ fieldA: 'yeah', arr: [1, 2, 3] })
  expect(store.current.fieldA).toBe('yeah')

  store.updateField('something else')
  expect(store.current.fieldA).not.toBe('yeah')

  store.pushNumber(4)
  expect(store.current.arr).toMatchObject([1, 2, 3, 4])

  store.pushNumbers([5, 6])
  expect(store.current.arr).toMatchObject([1, 2, 3, 4, 5, 6])
})
