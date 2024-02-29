import styles from '@/styles/components/content/Text.module.scss'
export const Text = ({ text }: { text: string }) => (
  <div className={styles.contenttext} dangerouslySetInnerHTML={{ __html: text }} />
)
