#magick assets/works/thumbnails/shinjuku.gif -quality 80 -loop 0 -delay 5 assets/works/thumbnails/shinjuku.webp

# Using ffmpeg
ffmpeg -i assets/works/thumbnails/shinjuku.gif -vf "scale=1200:900" -quality 75 -loop 0 -pix_fmt yuva420p -vcodec webp assets/works/thumbnails/shinjuku.webp
