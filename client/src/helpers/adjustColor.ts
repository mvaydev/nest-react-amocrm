/**
 * Change color brightness
 * @param hex color string in format: '#000000'
 * @param amount how much birghter in decimal units
 */
export function adjustColor(hex: string, amount: number) {
    const color = parseInt(hex.startsWith('#') ? hex.slice(1) : hex, 16)

    const r = Math.min(255, Math.max(0, (color >> 16) + amount))
    const g = Math.min(255, Math.max(0, ((color & 0x00ff00) >> 8) + amount))
    const b = Math.min(255, Math.max(0, (color & 0x0000ff) + amount))

    return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`
}
