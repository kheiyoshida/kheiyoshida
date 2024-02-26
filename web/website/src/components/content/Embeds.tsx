import { MouseEventHandler, useEffect, useRef } from 'react'

export const Embed = ({ iFrame }: { iFrame: string }) => {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (ref.current) {
      resizeIFrames(ref.current)
    }
  }, [ref])
  return <div ref={ref} dangerouslySetInnerHTML={{ __html: iFrame }} />
}

const resizeIFrames = (iFrameContainer: HTMLDivElement) => {
  const frames = iFrameContainer.getElementsByTagName('iframe')
  for (let i = 0; i < frames.length; i++) {
    const fr = frames[i]
    const [w, h] = [fr.width, fr.height]
    if (!w.includes('100%') || h.includes('100%')) {
      const ratio = `${parseInt(w)} / ${parseInt(h)}`
      fr.width = '100%'
      fr.height = 'auto'
      fr.style.aspectRatio = ratio
    }
  }
}

export const SketchEmbed = ({ link }: { link: string }) => {
  const iframe = `<iframe width="1000" height="560" src="${link}" frameborder="0" loading="lazy" allowfullscreen></iframe>`
  const onClick: MouseEventHandler = (e) => {
    e.stopPropagation()
    window.location.href = link
  }
  return (
    <a className="iframeLink" href={link}>
      <div className="iframeLink__block" onClick={onClick} />
      <Embed iFrame={iframe} />
    </a>
  )
}
