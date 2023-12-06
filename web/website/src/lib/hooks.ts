import { useRouter } from 'next/router'
import { useEffect } from 'react'

export const useRouteChange = (cb: Function) => {
  const router = useRouter()
  useEffect(() => {
    router.events && router.events.on('routeChangeComplete', () => {
      cb()
    })
  }, [router, cb])
}
