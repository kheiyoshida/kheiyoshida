import { ProjectPageInfo, WithoutId } from '../types'
import { ContentData, insertSlug, worksLink } from './data'

const { wasted, shinjuku, forest, tp4, maze, medwEP, surfaceWater } = ContentData

const _ProjectEntities: WithoutId<ProjectPageInfo>[] = [
  {
    title: surfaceWater.title,
    date: surfaceWater.date,
    contents: [
      {
        image: {
          images: [
            {
              path: surfaceWater.thumbnail,
            },
          ],
          layout: 'row',
        },
      },

      {
        text: [
          surfaceWater.message.join(' '),
          surfaceWater.trackList.map((t, i) => `${i + 1}. ${t}`).join(`\n`),
        ].join(`\n`),
      },
      {
        image: {
          images: [
            {
              path: wasted.thumbnail,
              link: worksLink(wasted.title),
            },
            {
              path: shinjuku.thumbnail,
              link: worksLink(shinjuku.title),
            },
          ],
        },
      },
    ],
  },
  {
    title: 'forest',
    date: forest.date,
    contents: [
      {
        image: {
          images: [
            {
              path: forest.thumbnail,
              link: worksLink(forest.title),
            },
          ],
          layout: 'row',
        },
      },
      {
        text: `<a href="${worksLink(forest.title)}">Click here to play</a>`,
      },
      ...forest.caption.map((text) => ({ text })),
      {
        image: {
          images: forest.screenshots
            .slice(0, 4)
            .map((path) => ({ path, link: worksLink(forest.title) })),
          layout: 'grid',
        },
      },
      ...forest.comments.map((text) => ({ text })),
      {
        image: {
          images: forest.screenshots
            .slice(4)
            .map((path) => ({ path, link: worksLink(forest.title) })),
          layout: 'grid',
        },
      },
    ],
  },
  {
    title: 'maze',
    date: maze.date,
    contents: [
      {
        image: {
          images: maze.images.map((img) => ({ path: img, link: worksLink(maze.title) })),
        },
      },
      {
        text: `<a href="${worksLink(maze.title)}">Click here to play</a>`,
      },
      ...maze.caption.map((text) => ({ text })),
    ],
  },
  {
    title: 'medw',
    date: medwEP.date,
    contents: [
      {
        image: {
          images: [
            {
              path: medwEP.artwork,
            },
          ],
        },
      },
      {
        embed: [medwEP.bandcamp],
      },
      {
        image: {
          images: [
            {
              path: tp4.thumbnail,
              link: worksLink(tp4.title),
            },
          ],
        },
      },
      {
        text: medwEP.caption,
      },
    ],
  },
]
export const ProjectEntities: ProjectPageInfo[] = _ProjectEntities.map(insertSlug)
