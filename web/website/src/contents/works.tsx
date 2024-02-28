import { WithoutId, WorkPageInfo } from '../types'
import { ContentData, insertSlug, worksLink } from './data'

const { wasted, shinjuku, forest, tp4, regrets, maze, medwEP, gene, zen4computers, kano } =
  ContentData

const makePaths = (title: string, paths: string[]) =>
  paths.map((p) => ({ path: p, link: worksLink(title) }))

const _WorkEntities: WithoutId<WorkPageInfo>[] = [
  {
    title: wasted.title,
    date: wasted.date,
    thumbnail: {
      images: makePaths(wasted.title, [wasted.thumbnail]),
    },
    contents: wasted.sketch,
  },
  {
    title: shinjuku.title,
    date: shinjuku.date,
    thumbnail: { images: makePaths(shinjuku.title, [shinjuku.thumbnail]) },
    contents: shinjuku.sketch,
    caption: shinjuku.caption,
  },
  {
    title: forest.title,
    date: forest.date,
    thumbnail: { images: makePaths(forest.title, [forest.thumbnail]) },
    contents: forest.sketch,
    caption: forest.caption.concat(''),
  },
  {
    title: tp4.title,
    date: tp4.date,
    thumbnail: { images: makePaths(tp4.title, [tp4.thumbnail]) },
    contents: tp4.sketch,
  },
  {
    title: regrets.title,
    date: regrets.date,
    thumbnail: { images: makePaths(regrets.title, [regrets.thumbnail]) },
    contents: regrets.sketch,
  },
  // {
  //   title: maze.title,
  //   date: maze.date,
  //   contents: [
  //     {
  //       images: [...maze.images],
  //     },
  //     {
  //       embed: [maze.sketch],
  //     },
  //     {
  //       text: maze.caption.slice(),
  //     },
  //   ],
  // },
  {
    title: medwEP.title,
    date: medwEP.date,
    thumbnail: { images: makePaths(medwEP.title, [medwEP.artwork]) },
    contents: [
      {
        image: { images: makePaths(medwEP.title, [medwEP.artwork]) },
      },
      {
        embed: [medwEP.bandcamp],
      },
    ],
  },
  {
    title: gene.title,
    date: gene.date,
    thumbnail: {
      images: makePaths(gene.title, gene.images.slice(0, 2)),
      layout: 'row',
    },
    contents: [
      {
        image: { images: makePaths(gene.title, gene.images.slice()), layout: 'row' },
      },
    ],
    caption: forest.caption
  },
  {
    title: zen4computers.title,
    date: zen4computers.date,
    thumbnail: {
      images: makePaths(zen4computers.title, zen4computers.images.slice(0, 2)),
      layout: 'grid',
    },
    contents: [
      {
        image: {
          images: makePaths(zen4computers.title, zen4computers.images.slice()),
          layout: 'grid',
        },
      },
    ],
  },
]

export const WorkEntities: WorkPageInfo[] = _WorkEntities.map(insertSlug)
