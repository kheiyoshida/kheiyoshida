import { ChannelRemote } from './remote'

test(`${ChannelRemote.name}`, () => {
  const remote = new ChannelRemote(3)

  expect(remote.next()).toBe(1)
  expect(remote.next()).toBe(2)
  expect(remote.next()).toBe(0)

  remote.switchRate[0] = 1.0
  remote.switchRate[1] = 0.0
  remote.switchRate[2] = 0.0

  for(let i = 0; i < 10; i++) {
    expect(remote.random()).toBe(0) // 100% 0
  }

  remote.switchRate[0]
})
