import React from 'react'
import styles from './layout.module.css'

interface LayoutStackProps {
  children?: any
}

export const LayoutStack: React.FC<LayoutStackProps> = (
  props: LayoutStackProps
) => {
  return <div className={styles.layoutStack}>{props.children}</div>
}
