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
          `<iframe width="560" height="315" src="https://www.youtube.com/embed/b0d6twT3bgM?si=Q89mjSr4ZP7QcGwu" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>`
        ],
      },
      {
        text: `<a href="https://83ssds.csb.app/" target="_blank" rel="noopener">Play the demo in sandbox environment</a>`
      },
      {
        text: `MGNR is a generative music library built for JavaScript. It generates musical sequences in real time based on a number of modifiable parameters that change the range of random musical notes.`
      },
      {
        text: `The focus of this package is on the algorithmic generation of music. By providing an explicit interface that can change musical sequences, it opens up possibilities for web-based interactive works, including my projects "<a href="/play/maze">maze</a>" and "<a href="/play/forest">forest</a>".`,
      },
      {
        embed: [
          `<iframe width="560" height="315" src="https://www.youtube.com/embed/5EWKIUT_irc?si=IfkM6tSKaz6SU-v0" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>`,
          `<iframe width="560" height="315" src="https://www.youtube.com/embed/39rSydC9NzI?si=lPAhnJLxH4gMPZGc" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>`,
        ],
      },
      {
        text: `The output of the package can be used with the WebAudio API package Tone.js or transported to general MIDI inputs such as DAW software.`
      },
      {
        text: `MGNR can be installed via the npm package registry. You can also try the package in the sandbox environment on the <a href="https://mgnr-lib.vercel.app">documentation page</a>.`
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
      {
        embed: [surfaceWater.bandcamp]
      },
      // ...Object.entries(surfaceWater.links).map(([k, v]) => ({
      //   text: `<a href="${v}">Listen on ${k}</a>`,
      // })),
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
