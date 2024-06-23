import { createMusicCommandBuffer } from './commands'

describe(`${createMusicCommandBuffer.name}`, () => {
  it(`should store incoming command`, () => {
    const buffer = createMusicCommandBuffer()
    buffer.update({
      alignment: 'chaos',
      aesthetics: null,
    })
    expect(buffer.get()).toMatchObject(['chaos'])
  })
  it(`should flush after get()`, () => {
    const buffer = createMusicCommandBuffer()
    buffer.update({
      alignment: 'chaos',
      aesthetics: null,
    })
    expect(buffer.get()).toMatchObject(['chaos'])
    expect(buffer.get()).toHaveLength(0)
  })
  it(`should preserve aesthetics even when update occurs on alignment`, () => {
    const buffer = createMusicCommandBuffer()
    buffer.update({
      alignment: 'chaos',
      aesthetics: null,
    })
    buffer.update({
      alignment: null,
      aesthetics: 'dark',
    })
    expect(buffer.get()).toMatchObject(['dark', 'chaos'])
  })
})
