import imagemin from 'imagemin'
import imageminGif2webp from 'imagemin-gif2webp'

await imagemin([`originalAssets/works/thumbnails/*.gif`], {
  destination: `out/works/thumbnails`,
  plugins: [imageminGif2webp({ quality: 75 })],
})
