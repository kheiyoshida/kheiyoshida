import { createMusicCommandBuffer } from "./commands";

describe(`${createMusicCommandBuffer.name}`, () => {
  it(`should store incoming command`, () => {
    const buffer = createMusicCommandBuffer()
    buffer.update({
      alignment: 'chaos',
      aesthetics: null,
    })
    expect(buffer.get()).toBe('chaos')
  })
  it(`should flush after get()`, () => {
    const buffer = createMusicCommandBuffer()
    buffer.update({
      alignment: 'chaos',
      aesthetics: null,
    })
    expect(buffer.get()).toBe('chaos')
    expect(buffer.get()).toBeNull()
  })
  it(`should prefer aesthetics over alignment`, () => {
    const buffer = createMusicCommandBuffer()
    buffer.update({
      alignment: 'chaos',
      aesthetics: null,
    })
    buffer.update({
      alignment: 'chaos',
      aesthetics: 'dark',
    })
    expect(buffer.get()).toBe('dark')
  })
  it(`should preserve aesthetics`, () => {
    const buffer = createMusicCommandBuffer()
    buffer.update({
      alignment: 'chaos',
      aesthetics: 'dark',
    })
    buffer.update({
      alignment: 'chaos',
      aesthetics: null,
    })
    expect(buffer.get()).toBe('dark')
  })
})