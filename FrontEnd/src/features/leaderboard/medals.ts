const MEDAL_COLORS: Record<number, string> = {
  1: 'var(--color-gold)',
  2: 'var(--color-silver)',
  3: 'var(--color-bronze)',
}

export function medalColor(position: number): string | undefined {
  return MEDAL_COLORS[position]
}
