import styles from '@/styles/components/site/Menu.module.scss'
import { createContext, useContext, useState } from 'react'
import { Slug } from '../../constants'
import { Links } from '../../contents/links'
import { ProjectEntities } from '../../contents/projects'
import { useSPALink } from '../../lib/route'
import { Modal } from './Modal'

type Menu2Items = 'projects' | 'links' | 'about'

const useMenu = () => {
  const [isOpenLv1, setOpen1] = useState(false)
  const [isOpenLv2, setOpen2] = useState<Menu2Items[]>(['projects'])

  const toggleLv1 = () => setOpen1((open1) => !open1)

  const toggleLv2 = (item: Menu2Items) => {
    if (isOpenLv2.includes(item)) {
      setOpen2([...isOpenLv2].filter((i) => i !== item))
    } else {
      setOpen2([...isOpenLv2, item])
    }
  }

  return {
    isOpenLv1,
    isOpenLv2,
    toggleLv1,
    toggleLv2,
  }
}

const MenuContext = createContext({} as ReturnType<typeof useMenu>)

export const Menu = () => {
  const menu = useMenu()

  return (
    <MenuContext.Provider value={menu}>
      <div className={styles.spmenu}>
        {menu.isOpenLv1 ? (
          <Modal close={() => undefined}>
            <MenuLv1 />
          </Modal>
        ) : (
          <div onClick={menu.toggleLv1} className={styles.minimized}>
            kheiyoshida
          </div>
        )}
      </div>
    </MenuContext.Provider>
  )
}

export const MenuLv1 = () => {
  const { toggleLv1 } = useContext(MenuContext)
  return (
    <div className={styles.menu}>
      <div onClick={toggleLv1} className={styles.menu__item__lv1}>
        kheiyoshida
      </div>
      <MenuLv2 />
    </div>
  )
}

const MenuLv2 = () => {
  const { isOpenLv2: opened, toggleLv2: toggleItem, toggleLv1 } = useContext(MenuContext)
  const handleClickLink = useSPALink(toggleLv1)
  return (
    <>
      <a href={'/'} className={styles.menu__item__lv2} onClick={handleClickLink}>
        ~
      </a>
      <div onClick={() => toggleItem('projects')} className={styles.menu__item__lv2}>
        Projects
      </div>
      {opened.includes('projects')
        ? ProjectEntities.map((pj) => (
            <a
              className={styles.menu__item__lv3}
              href={`/${Slug.projects}/${pj.id}`}
              key={`entry-${pj.id}`}
              onClick={handleClickLink}
            >
              {pj.title.toUpperCase()}
            </a>
          ))
        : null}
      <div onClick={() => toggleItem('links')} className={styles.menu__item__lv2}>
        Links
      </div>
      {opened.includes('links')
        ? socialLinks.map((link, i) => (
            <a className={styles.menu__item__lv3} href={link.href} key={`link-${i}`}>
              {link.name}
            </a>
          ))
        : null}
      <div onClick={() => toggleItem('about')} className={styles.menu__item__lv2}>
        <a href={`/${Slug.about}`} onClick={handleClickLink}>
          About
        </a>
      </div>
    </>
  )
}

const socialLinks: { href: string; name: string }[] = [
  {
    href: Links.instagram,
    name: 'Instagram',
  },
  {
    href: Links.github,
    name: 'Github',
  },
]
