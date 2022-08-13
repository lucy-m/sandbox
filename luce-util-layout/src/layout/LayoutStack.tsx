import React from 'react'
import styles from './layout.module.scss'
import { getSpacing, Spacing } from './spacing'

interface LayoutStackProps {
  children?: any
  spacing?: Spacing
}

export const LayoutStack: React.FC<LayoutStackProps> = (
  props: LayoutStackProps
) => {
  const className = [
    styles.layoutStack,
    styles[getSpacing(props.spacing)]
  ].join(' ')

  return <div className={className}>{props.children}</div>
}
