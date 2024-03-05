import { useRouter } from 'next/router'
import { Slug } from '../constants'

export const useSPALink = (cb?: () => void) => {
  const router = useRouter()
  const handleClickLink = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!router.pathname.includes(Slug.works)) {
      e.preventDefault()
      const href = e.currentTarget.getAttribute('href')
      router.push(href!)
      cb && cb()
    } else {
      // just load the next page to reset p5 and stuff
    }
  }
  return handleClickLink
}
