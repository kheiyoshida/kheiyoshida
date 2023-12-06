import { MouseEventHandler, useEffect, useRef } from "react";

const resizeIFrames = (el: HTMLDivElement) => {
  const frames = el.getElementsByTagName('iframe')
  for (let i = 0; i<frames.length; i++) { 
    const fr = frames[i]
    const [w, h] = [
      fr.width,
      fr.height
    ]
    if (!w.includes('100%') || h.includes('100%')) {
      const ratio = `${parseInt(w)} / ${parseInt(h)}`
      fr.width = '100%'
      fr.height = 'auto'
      fr.style.aspectRatio = ratio
    }
  }
}

export const Embeds = ({embeds, k}: {embeds: string[], k: string}) => {

  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (ref.current) {
      resizeIFrames(ref.current)
    }
  }, [ref])
  
  return (
    <>
      {
        embeds.map((em, idx) => (
          <div
            ref={ref}
            key={`${k}-embed-${idx}`}
            dangerouslySetInnerHTML={{__html: em}} 
          />
        ))
      }
    </>
  )
}

export const SketchEmbed = ({title, k}: {title: string, k: string}) => {
  const link = `https://sketch.kheiyoshida.com/${title}`
  const iframe = `<iframe width="1000" height="560" src="${link}" title="${title}" frameborder="0" loading="lazy" allowfullscreen></iframe>`
  const onClick: MouseEventHandler = (e) => {
    e.stopPropagation()
    window.location.href = link
  }
  return (
    <a className="iframeLink" href={link} >
      <div className="iframeLink__block" onClick={onClick}/>
      <Embeds embeds={[iframe]} k={k} />
    </a>
  )
}

export const OtherEmbed = ({title, k, info}: {title: string, k: string, info: Work['info']}) => {
  const link = info!.link
  const iframe = `<iframe width="1000" height="560" src="${link}" title="${title}" frameborder="0" loading="lazy" allowfullscreen></iframe>`
  const onClick: MouseEventHandler = (e) => {
    e.stopPropagation()
    window.location.href = link
  }
  return (
    <a className="iframeLink" href={link} onClick={onClick}>
      <div className="iframeLink__block red" >visit: {link}</div>
      <Embeds embeds={[iframe]} k={k} />
    </a>
  )
}
