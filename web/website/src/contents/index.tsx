import { WorksData } from './works'

const { wasted, shinjuku, forest, tp4, regrets, maze, medwEP, gene, zen4computers, kano } =
  WorksData

export const WorkEntities: Work[] = [
  { title: wasted.title, date: wasted.date, contents: [{ sketch: [wasted.sketch] }] },
  {
    title: shinjuku.title,
    date: shinjuku.date,
    contents: [
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
      { sketch: [forest.sketch] },
      {
        text: [forest.caption],
      },
    ],
  },
  {
    title: tp4.title,
    date: tp4.date,
    contents: [{ sketch: [tp4.sketch] }],
  },
  {
    title: regrets.title,
    date: regrets.date,
    contents: [
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
