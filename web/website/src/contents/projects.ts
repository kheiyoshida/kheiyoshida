import { ProjectPageInfo, WithoutId } from '../types'
import { ContentData, insertSlug, worksLink } from './data'

const { wasted, shinjuku, forest, tp4, maze, medwEP, surfaceWater, regrets } = ContentData

const _ProjectEntities: WithoutId<ProjectPageInfo>[] = [
  {
    title: 'mgnr',
    date: '2023-',
    contents: [
      {
        embed: [
          `<iframe
          width="560"
          height="315"
          src="https://www.youtube.com/embed/5oNRNsfQMAU?si=TzKii9WX0zxE9t-l"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        ></iframe>`,
          `<iframe width="560" height="315" src="https://www.youtube.com/embed/5EWKIUT_irc?si=IfkM6tSKaz6SU-v0" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>`,
          `<iframe width="560" height="315" src="https://www.youtube.com/embed/39rSydC9NzI?si=lPAhnJLxH4gMPZGc" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>`
        ],
      },
      {
        text: `<a href="https://mgnr-lib.vercel.app">documentation page</a>`,
      },
      {
        text: `mgnr is a generative music library for javascript. I've been developing the package as I develop other projects including maze, forest, and other music works`,
      },
    ],
  },
  {
    title: 'MAZE',
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
      {
        text: '--ChangeLog--',
      },
      {
        text: maze.changeLog.join(`\n`),
      },
    ],
  },
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
        text: surfaceWater.message[0],
      },
      ...Object.entries(surfaceWater.links).map(([k, v]) => ({
        text: `<a href="${v}">Listen on ${k}</a>`,
      })),
      {
        text: surfaceWater.caption.join(''),
      },
      {
        image: {
          images: [
            {
              path: regrets.thumbnail,
              link: worksLink(regrets.title),
            },
            {
              path: wasted.thumbnail,
              link: worksLink(wasted.title),
            },
            {
              path: shinjuku.thumbnail,
              link: worksLink(shinjuku.title),
            },
          ],
          layout: 'grid',
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
          images: forest.screenshots.slice(0, 4).map((path) => ({ path, link: worksLink(forest.title) })),
          layout: 'grid',
        },
      },
      ...forest.comments.map((text) => ({ text })),
      {
        image: {
          images: forest.screenshots.slice(4).map((path) => ({ path, link: worksLink(forest.title) })),
          layout: 'grid',
        },
      },
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
