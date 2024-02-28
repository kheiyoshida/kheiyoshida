import { useRouter } from 'next/router'
import { useEffect } from 'react'

export const useRouteChange = (cb: () => void) => {
  const router = useRouter()
  useEffect(() => {
    router.events &&
      router.events.on('routeChangeComplete', () => {
        cb()
      })
  }, [router, cb])
}
