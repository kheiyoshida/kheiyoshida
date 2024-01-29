import { listMagnifyCandidates } from './magnify';

test(`${listMagnifyCandidates.name}`, () => {
  const size = {
    width: 960,
    height: 540,
  };
  const result = listMagnifyCandidates(size, 160);
  expect(result).toMatchObject([1, 1.5, 2, 3, 6]);
});
