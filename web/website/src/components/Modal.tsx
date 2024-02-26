import styles from '@/styles/components/Modal.module.scss'

export interface ModalProps extends React.PropsWithChildren {
  close: () => void
}

export const Modal = ({ close, children }: ModalProps) => {
  return (
    <div className={styles.modal} onClick={close}>
      <div className={styles.modal__content} onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  )
}
