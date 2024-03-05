import { WithoutId, WorkPageInfo } from '../types'
import { ContentData, insertSlug, worksLink } from './data'

const { wasted, shinjuku, forest, tp4, maze, medwEP, gene, zen4computers, surfaceWater } =
  ContentData

const makePathsWithLink = (title: string, paths: string[], placeholderPath?: string) =>
  paths.map((p) => ({ path: p, link: worksLink(title), placeholderPath: placeholderPath || null }))

const makePathsWithoutLink = (paths: string[]) => paths.map((p) => ({ path: p }))

const _WorkEntities: WithoutId<WorkPageInfo>[] = [
  {
    title: surfaceWater.title,
    thumbnail: {
      images: [{ path: surfaceWater.thumbnail, link: worksLink(surfaceWater.title) }],
    },
    date: surfaceWater.date,
    caption: surfaceWater.message.join(' '),
    contents: [
      {
        image: {
          images: [
            {
              path: surfaceWater.thumbnail,
            },
          ],
        },
      },
    ],
  },
  {
    title: wasted.title,
    date: wasted.date,
    thumbnail: {
      images: makePathsWithLink(wasted.title, [wasted.thumbnail], wasted.placeholder),
    },
    contents: wasted.sketch,
  },
  {
    title: shinjuku.title,
    date: shinjuku.date,
    thumbnail: { images: makePathsWithLink(shinjuku.title, [shinjuku.thumbnail], shinjuku.placeholder) },
    contents: shinjuku.sketch,
    caption: shinjuku.caption.join(' '),
  },
  {
    title: forest.title,
    date: forest.date,
    thumbnail: { images: makePathsWithLink(forest.title, [forest.thumbnail], forest.placeholder) },
    contents: forest.sketch,
    caption: forest.caption.join(''),
  },
  {
    title: tp4.title,
    date: tp4.date,
    thumbnail: { images: makePathsWithLink(tp4.title, [tp4.thumbnail], tp4.placeholder) },
    contents: tp4.sketch,
    caption: tp4.caption,
  },
  {
    title: maze.title,
    date: maze.date,
    contents: maze.sketch,
    thumbnail: { images: makePathsWithLink(maze.title, [...maze.images], maze.placeholder) },
    caption: maze.caption.join(` `),
  },
  {
    title: medwEP.title,
    date: medwEP.date,
    thumbnail: { images: makePathsWithLink(medwEP.title, [medwEP.artwork]) },
    contents: [
      {
        image: { images: [{ path: medwEP.artwork }] },
      },
      {
        embed: [medwEP.bandcamp],
      },
    ],
    caption: medwEP.caption,
  },
  {
    title: gene.title,
    date: gene.date,
    thumbnail: {
      images: makePathsWithLink(gene.title, gene.images.slice(0, 2)),
      layout: 'row',
    },
    contents: [
      {
        image: { images: makePathsWithoutLink(gene.images), layout: 'row' },
      },
    ],
  },
  {
    title: zen4computers.title,
    date: zen4computers.date,
    thumbnail: {
      images: makePathsWithLink(zen4computers.title, zen4computers.images.slice(0, 2)),
      layout: 'grid',
    },
    contents: [
      {
        image: {
          images: makePathsWithoutLink(zen4computers.images),
          layout: 'grid',
        },
      },
    ],
  },
]

export const WorkEntities: WorkPageInfo[] = _WorkEntities.map(insertSlug)
