import { loop2D } from 'utils'
import { RGBA } from '../../data/matrix'
import { createUpdateBuffer, createUpdateBufferArray } from './updateBuffer'

test(`${createUpdateBufferArray.name}`, () => {
  const bufferArray = createUpdateBufferArray({ width: 4, height: 3 })
  expect(bufferArray.length).toBe(3)
  expect(bufferArray[0].length).toBe(4)
  expect(bufferArray[0][0]).toBeUndefined()
})

test(`${createUpdateBuffer.name}`, () => {
  const buffer = createUpdateBuffer({ width: 10, height: 10 })
  const value: RGBA = [255, 0, 0, 100]
  loop2D(10, (x,y) => {
    if (x===y) {
      buffer.update(x,y, value)
    }
  })
  expect(buffer.get(2, 2)).toMatchObject(value)
  expect(buffer.get(2, 3)).toBeUndefined()
})
