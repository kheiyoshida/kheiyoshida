import { ContentData, insertSlug } from './data'

const { wasted, shinjuku, forest, tp4, regrets, maze, medwEP, gene, zen4computers, kano } =
  ContentData

const _ProjectEntities: ContentWithoutId[] = [
  {
    title: 'Surface Water',
    date: '240226',
    contents: [
      { sketch: [wasted.sketch] },
      { sketch: [shinjuku.sketch] },
      { sketch: [regrets.sketch] },
    ],
  },
  {
    title: 'forest',
    date: forest.date,
    contents: [
      { sketch: [forest.sketch] },
      { text: [forest.caption] },
    ],
  },
  {
    title: 'maze',
    date: maze.date,
    contents: [
      { sketch: [maze.sketch] },
      { text: [...maze.caption] },
    ],
  },
  {
    title: 'medw',
    date: medwEP.date,
    contents: [
      { sketch: [tp4.sketch] },
      { images: [medwEP.artwork]},
      { embed: [medwEP.bandcamp]}
    ],
  },
]
export const ProjectEntities: ContentPageInfo[] = _ProjectEntities.map(insertSlug)