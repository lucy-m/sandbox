export type Spacing = 'snug' | 'normal' | 'loose' | 'none'

export const getSpacing = (s?: Spacing | undefined): Spacing => s || 'normal'
