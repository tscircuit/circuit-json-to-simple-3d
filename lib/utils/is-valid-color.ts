import { validColorNames } from "./constants"

export const isValidColor = (color: string): boolean => {
  const colorStr = color.toLowerCase()

  if (colorStr.startsWith("#")) {
    if (colorStr.length === 7 || colorStr.length === 4) {
      const hex = colorStr.slice(1)
      if (colorStr.length === 4) {
        return /^[0-9a-f]{3}$/i.test(hex)
      } else {
        return /^[0-9a-f]{6}$/i.test(hex)
      }
    }
    return false
  }

  if (validColorNames.includes(colorStr)) {
    return true
  }

  if (colorStr.startsWith("rgb(") || colorStr.startsWith("rgba(")) {
    return /^rgba?\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*(,\s*[\d.]+\s*)?\)$/i.test(
      colorStr,
    )
  }

  return false
}
