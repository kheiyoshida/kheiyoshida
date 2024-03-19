import { Slug } from '../constants'
import { resolveImagekitPath } from '../lib/image'
import { ContentPageInfo, WithoutId } from '../types'

const thumbnailPath = (name: string) => resolveImagekitPath('works', 'thumbnails', name)

export const insertSlug = <T extends ContentPageInfo>(content: WithoutId<T>) => ({
  ...content,
  id: titleToSlug(content.title),
})
export const titleToSlug = (title: string) => title.replaceAll(' ', '-').toLowerCase()
export const worksLink = (title: string) => '/' + [Slug.works, titleToSlug(title)].join('/')

export enum Sketch {
  wasted = 'wasted',
  shinjuku = 'shinjuku',
  forest = 'forest',
  tp4 = 'tp4',
  regrets = 'regrets',
  maze = 'maze',
}

export const ContentData = {
  surfaceWater: {
    title: 'Surface Water',
    date: '2024',
    thumbnail: resolveImagekitPath('works', 'surface-water', 'surface-water.png'),
    trackList: ['profit', 'shinjuku', 'wasted', '018th', 'regrets', 'platonic', 'divec'],
    message: [
      `I am releasing an album "Surface Water" this spring.`,
      `The album will be available on Bandcamp and streaming services.`,
    ],
    caption: [
      `Music is an interface. It's the interface to connect to something obscure and vague within yourself, which existence you need a "clue" to assume. Some music helps. It's like the water on the surface, which actually comes from the earth's underground even though all you can see are the waves on the surface. I made that kind of music through the experiments of music-generating programs, layered rhythms, and randomization of sound. I am excited to finally release this collection of works from the past 4 years or so (since when I started those experiments).`,
    ]
  },
  wasted: {
    title: 'wasted',
    date: '2024',
    sketch: Sketch.wasted,
    thumbnail: thumbnailPath('wasted.gif'),
    placeholder: thumbnailPath('wasted.png'),
    caption: ``,
  },
  shinjuku: {
    title: 'shinjuku',
    date: '2024',
    sketch: Sketch.shinjuku,
    soundcloud:
      '<iframe style="margin-top: 8px;" width="100%" height="166" scrolling="no" frameborder="no" allow="autoplay" src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/1733015109&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true"></iframe>',
    youtube:
      '<iframe width="560" height="315" src="https://www.youtube.com/embed/lqn06t1xFOE?si=3C_m7jlGAPoFHtok" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>',
    youtubeLink: `https://www.youtube.com/watch?v=lqn06t1xFOE`,
    caption: [
      `Every time you walk through the crowd in a city, you walk past the shadows of them.`,
      `Sometimes you don't even realize they all have their names.`,
      `They are the anonymous shadows, and so are you to them.`,
      `Every time I walk through the Shinjuku station, which is one of the busiest with millions of people every day, I find myself blurred.`,
      ` So I shot tens of videos in the city, then I treated them as indifferent figures and turned them into this work.`,
      `* If you have any issues with rendering of the work, you can also watch on <a href="https://www.youtube.com/watch?v=lqn06t1xFOE">YouTube</a>`,
    ],
    thumbnail: thumbnailPath('shinjuku.gif'),
    placeholder: thumbnailPath('shinjuku.png'),
  },
  forest: {
    title: 'forest',
    date: '2024',
    sketch: Sketch.forest,
    caption: [
      `Walk through your virtual forest that never ends.`,
      `This forest is where the music is also the one who listens. As you play the game, the music pattern changes based on your actions.`,
    ],
    caution: [
      `* If you're in an In-app browsers (Instagram's etc), open the link in an external browser.`,
    ],
    comments: [
      `I implemented this interactive project as an ambient video game that tries to provide a place where you will be the only character in the narrative, yet you still have a subtle sense of being seen, heard, or judged.`,
      `This is initially developed as a playground for my in-development music project "mgnr", a library to programmatically generate music.`,
    ],
    thumbnail: thumbnailPath('forest.gif'),
    placeholder: thumbnailPath('forest.png'),
    screenshots: [...Array(8)].map((_, i) =>
      resolveImagekitPath('works', 'forest', `forest${i + 1}.png`)
    ),
  },
  tp4: {
    title: 'tp4',
    date: '2023',
    sketch: Sketch.tp4,
    thumbnail: thumbnailPath('tp4.gif'),
    placeholder: thumbnailPath('tp4.png'),
    caption: [
      `I felt like dancing, so I made a graph network dance.Each node has its frequency to dance to (like you react to a kick), and significant sound makes it produce child nodes. (Audio data is FFT-analyzed via WebAudio API)`,
      `The song's taken from the EP I released last year: <a href="https://kheiyoshida.bandcamp.com/album/medw">https://kheiyoshida.bandcamp.com/album/medw</a>`,
    ],
  },
  regrets: {
    title: 'regrets',
    date: '2024',
    sketch: Sketch.regrets,
    thumbnail: thumbnailPath('regrets.webp'),
    placeholder: thumbnailPath('regrets.png'),
  },
  maze: {
    title: 'maze',
    date: '2023',
    sketch: Sketch.maze,
    caption: [
      'Explore different auto-generated mazes in every play. ',
      'The art is also randomly generated, which you will never see again.',
      'The music is fully scripted. It’s not using any audio files.',
      'There’s no objective in this game. But I hope you’ll find a story that can’t be interpreted into words.',
      'On every major release, I will put seeds of stories into this game.  ',
    ],
    images: [thumbnailPath('maze.gif')],
    placeholder: thumbnailPath('maze.png'),
  },
  medwEP: {
    title: 'medw e.p.',
    date: '2022',
    artwork: resolveImagekitPath('works', '221201', 'medw.png'),
    bandcamp:
      '<iframe style="border: 0; height: 274px;" src="https://bandcamp.com/EmbeddedPlayer/album=3299876757/size=large/bgcol=ffffff/linkcol=0687f5/artwork=small/transparent=true/" seamless><a href="https://kheiyoshida.bandcamp.com/album/medw">medw by Khei Yoshida</a></iframe>',
    caption: `An EP with 4 songs made exploiting the over-editing of the sound, which I think ended up with intriguing rhthms and ambience. 
      <br />You can lisen to it on <a href="https://open.spotify.com/album/2wrZ8mU7TPvzOVcm7aMDqJ?si=2XVjlRTLRPayZyfuQHYx-Q">Spotify</a> and other subscription services.`,
  },
  gene: {
    title: 'Gene',
    date: '2022',
    images: [
      'gene_1.png',
      'gene_2.png',
      'gene_3.png',
      'gene_4.png',
      'gene_5.png',
      'gene_6.png',
      'gene_7.png',
      'gene_8.png',
    ].map((name) => resolveImagekitPath('works', '221129', name)),
  },
  zen4computers: {
    title: 'Zen 4 Computers',
    date: '2022',
    images: ['bonsai1.png', 'bonsai2.png', 'bonsai3.png', 'bonsai4.png', 'bonsai5.png'].map(
      (name) => resolveImagekitPath('works', '221125', name)
    ),
    imageLayout: 'grid',
  },
  kano: {
    title: 'Kano',
    date: '2022',
    youtube:
      '<iframe width="560" height="315" src="https://www.youtube.com/embed/pj1A4TFzog0?controls=0" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>',
    soundcloud:
      '<iframe width="100%" height="166" scrolling="no" frameborder="no" allow="autoplay" src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/1385527513&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true"></iframe>',
  },
} as const
