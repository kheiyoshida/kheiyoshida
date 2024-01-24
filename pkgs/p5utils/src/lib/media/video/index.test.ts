import { loadVideoSourceList } from '.'

test(`${loadVideoSourceList.name}`, () => {
  const spyCreateVideo = jest.spyOn(p, 'createVideo')
  loadVideoSourceList(['video1_loc', 'video2_loc'])
  expect(spyCreateVideo).toHaveBeenCalledTimes(2)
})
