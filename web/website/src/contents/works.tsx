import { ContentData, insertSlug } from './data'

const { wasted, shinjuku, forest, tp4, regrets, maze, medwEP, gene, zen4computers, kano } =
  ContentData

const _WorkEntities: OnePartial<ContentPageInfo, 'id'>[] = [
  {
    title: wasted.title,
    date: wasted.date,
    contents: [
      {
        images: [wasted.thumbnail],
      },
      { sketch: [wasted.sketch] },
    ],
  },
  {
    title: shinjuku.title,
    date: shinjuku.date,
    contents: [
      {
        images: [shinjuku.thumbnail],
      },
      {
        sketch: [shinjuku.sketch],
      },
      {
        embed: [shinjuku.soundcloud, shinjuku.youtube],
      },
      {
        text: [shinjuku.caption],
      },
    ],
  },
  {
    title: forest.title,
    date: forest.date,
    contents: [
      {
        images: [forest.thumbnail],
      },
      { sketch: [forest.sketch] },
      {
        text: [forest.caption],
      },
    ],
  },
  {
    title: tp4.title,
    date: tp4.date,
    contents: [
      {
        images: [tp4.thumbnail],
      },
      { sketch: [tp4.sketch] },
    ],
  },
  {
    title: regrets.title,
    date: regrets.date,
    contents: [
      {
        images: [regrets.thumbnail],
      },
      {
        sketch: [regrets.sketch],
      },
      {
        embed: [regrets.soundcloud],
      },
    ],
  },
  {
    title: maze.title,
    date: maze.date,
    contents: [
      {
        images: [...maze.images],
      },
      {
        sketch: [maze.sketch],
      },
      {
        text: maze.caption.slice(),
      },
    ],
  },
  {
    title: medwEP.title,
    date: medwEP.date,
    contents: [
      {
        images: [medwEP.artwork],
      },
      {
        embed: [medwEP.bandcamp],
      },
    ],
  },
  {
    title: gene.title,
    date: gene.date,
    contents: [
      {
        images: gene.images.slice(),
      },
    ],
  },
  {
    title: zen4computers.title,
    date: zen4computers.date,
    contents: [
      {
        images: zen4computers.images.slice(),
      },
    ],
    options: {
      imageLayout: zen4computers.imageLayout,
    },
  },
  {
    title: kano.title,
    date: kano.date,
    contents: [
      {
        embed: [kano.youtube, kano.soundcloud],
      },
    ],
  },
]

export const WorkEntities: ContentPageInfo[] = _WorkEntities.map(insertSlug)
