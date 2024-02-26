  import { resolveImagekitPath } from '../lib/image'

const sketchLink = (slug: string) => `https://sketch.kheiyoshida.com/${slug}`

const thumbnailPath = (name: string) => resolveImagekitPath('works', 'thumbnails', name)

export const insertSlug = (content: OnePartial<ContentPageInfo, 'id'>) => ({
  ...content,
  id: content.title.replaceAll(' ', '-').toLowerCase(),
})

export const ContentData = {
  wasted: {
    title: 'wasted',
    date: '240220',
    sketch: sketchLink('wasted_revisited'),
    thumbnail: thumbnailPath('wasted.png'),
  },
  shinjuku: {
    title: 'shinjuku',
    date: '240131',
    sketch: sketchLink('shinjuku'),
    soundcloud:
      '<iframe style="margin-top: 8px;" width="100%" height="166" scrolling="no" frameborder="no" allow="autoplay" src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/1733015109&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true"></iframe>',
    youtube:
      '<iframe width="560" height="315" src="https://www.youtube.com/embed/lqn06t1xFOE?si=3C_m7jlGAPoFHtok" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>',
    caption: `
    Every time you walk through the crowd in a city, you walk past the shadows of them. Sometimes you don't even realize they all have their names. They are the anonymous shadows, and so are you to them. Every time I walk through the Shinjuku station, which is one of the busiest with millions of people every day, I find myself blurred. So I shot tens of videos in the city, then I treated them as indifferent figures and turned them into this work. 
    `,
    thumbnail: thumbnailPath('shinjuku.png'),
  },
  forest: {
    title: 'forest',
    date: '231119',
    sketch: sketchLink('mgnr-demo'),
    caption: `
    This is the playground for my in-development music project "mgnr", a library to programmatically generate music. As you play the demo, you will hear a variety of auto-generated patterns. The music generation is also based on your play style. Try to go through the weird forest, or stand still in the darkness. 
    `,
    thumbnail: thumbnailPath('forest.png'),
  },
  tp4: {
    title: 'tp4',
    date: '231024',
    sketch: sketchLink('tp4'),
    thumbnail: thumbnailPath('tp4.png'),
  },
  regrets: {
    title: 'regrets',
    date: '230927',
    sketch: sketchLink(`regrets`),
    soundcloud:
      '<iframe style="margin-top: 8px;" width="100%" height="166" scrolling="no" frameborder="no" allow="autoplay" src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/1625973738&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true"></iframe>',
    thumbnail: thumbnailPath('regrets.png'),
  },
  maze: {
    title: 'maze',
    date: '230519',
    sketch: 'https://maze.kheiyoshida.com',
    caption: [
      'My latest project “maze” is in development. Visit and play the beta version now. ',
      'Explore different auto-generated mazes in every play. ',
      'The art is also randomly generated, which you will never see again.',
      'The music is fully scripted. It’s not using any audio files.',
      'There’s no objective in this game. But I hope you’ll find a story that can’t be interpreted into words.',
      'On every major release, I will put seeds of stories into this game.  ',
    ],
    images: [thumbnailPath('maze.png'), thumbnailPath('maze2.png')],
  },
  medwEP: {
    title: 'medw e.p.',
    date: '221201',
    artwork: resolveImagekitPath('works', '221201', 'medw.png'),
    bandcamp:
      '<iframe style="border: 0; height: 274px;" src="https://bandcamp.com/EmbeddedPlayer/album=3299876757/size=large/bgcol=ffffff/linkcol=0687f5/artwork=small/transparent=true/" seamless><a href="https://kheiyoshida.bandcamp.com/album/medw">medw by Khei Yoshida</a></iframe>',
  },
  gene: {
    title: 'Gene',
    date: '221129',
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
    date: '221125',
    images: ['bonsai1.png', 'bonsai2.png', 'bonsai3.png', 'bonsai4.png', 'bonsai5.png'].map(
      (name) => resolveImagekitPath('works', '221125', name)
    ),
    imageLayout: 'grid',
  },
  kano: {
    title: 'Kano',
    date: '221118',
    youtube:
      '<iframe width="560" height="315" src="https://www.youtube.com/embed/pj1A4TFzog0?controls=0" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>',
    soundcloud:
      '<iframe width="100%" height="166" scrolling="no" frameborder="no" allow="autoplay" src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/1385527513&color=%23ff5500&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true"></iframe>',
  },
} as const
