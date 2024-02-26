import { useRouteChange } from '@/lib/hooks'
import styles from '@/styles/components/Menu.module.scss'
import workEntities from '@/works'
import Link from 'next/link'
import { useState } from 'react'
import { Modal } from './Modal'

export const SpMenu = () => {
  const [isOpen, setOpen] = useState(false)
  const open = () => setOpen(true)
  const close = () => setOpen(false)
  useRouteChange(close)

  return (
    <>
      {!isOpen ? (
        <div className="spmenu-btn" onClick={open}>
          kheiyoshida
        </div>
      ) : (
        <Modal close={close}>
          <Menu />
        </Modal>
      )}
    </>
  )
}

export const Menu = () => {
  const [open, setOpen] = useState(true)
  const toggle = () => setOpen((open) => !open)

  return (
    <div className={styles.menu}>
      <div onClick={toggle} className={styles.menu__item__lv1}>
        kheiyoshida
      </div>
      {open ? <Menu2 /> : null}
    </div>
  )
}

type Menu2Items = 'works' | 'links' | 'contact'

const Menu2 = () => {
  const [opened, setOpened] = useState<Menu2Items[]>([])
  const toggleItem = (item: Menu2Items) => {
    if (opened.includes(item)) {
      setOpened([...opened].filter((i) => i !== item))
    } else {
      setOpened([...opened, item])
    }
  }

  return (
    <>
      <Link href={'/'} className={styles.menu__item__lv2}>
        ~
      </Link>
      <div onClick={() => toggleItem('works')} className={styles.menu__item__lv2}>
        Works
      </div>
      {opened.includes('works')
        ? workEntities.map((work) => (
            <Link
              className={styles.menu__item__lv3}
              href={`/works/${work.date}`}
              key={`entry-${work.date}`}
            >
              {work.date} / {work.title}
            </Link>
          ))
        : null}
      <div onClick={() => toggleItem('links')} className={styles.menu__item__lv2}>
        Links
      </div>
      {opened.includes('links')
        ? Links.map((link, i) => (
            <a className={styles.menu__item__lv3} href={link.href} key={`link-${i}`}>
              {link.name}
            </a>
          ))
        : null}
      <div onClick={() => toggleItem('contact')} className={styles.menu__item__lv2}>
        Contact
      </div>
      {opened.includes('contact') ? (
        <div className={styles.menu__item__lv3}>kheiyoshida@gmail.com</div>
      ) : null}
    </>
  )
}

const Links: { href: string; name: string }[] = [
  {
    href: 'https://kheiyoshida.bandcamp.com/',
    name: 'bandcamp',
  },
  {
    href: 'https://www.instagram.com/kheiyoshida/',
    name: 'instagram',
  },
  {
    href: 'https://soundcloud.com/khei-yoshida',
    name: 'soundcloud',
  },
  {
    href: 'https://sketch.kheiyoshida.com',
    name: 'sketch',
  },
]
