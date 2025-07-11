import type { BackgroundOptions } from "../types"

export function getColorFromBackgroundOptions(
  background?: BackgroundOptions,
): string {
  if (!background) return "lightgray"

  if (background.color) {
    const colorStr = background.color.toLowerCase()

    if (background.opacity !== undefined) {
      if (
        colorStr.startsWith("#") &&
        (colorStr.length === 7 || colorStr.length === 4)
      ) {
        let hex = colorStr.replace("#", "")
        if (hex.length === 3) {
          hex = hex
            .split("")
            .map((char) => char + char)
            .join("")
        }

        if (/^[0-9a-f]{6}$/i.test(hex)) {
          const r = parseInt(hex.substr(0, 2), 16)
          const g = parseInt(hex.substr(2, 2), 16)
          const b = parseInt(hex.substr(4, 2), 16)
          const opacity = Math.max(0, Math.min(1, background.opacity))
          return `rgba(${r}, ${g}, ${b}, ${opacity})`
        }
      }
      return "lightgray"
    }

    if (isValidColor(background.color)) {
      return background.color
    }

    return "lightgray"
  }

  return "lightgray"
}

function isValidColor(color: string): boolean {
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

  const validColorNames = [
    "red",
    "green",
    "blue",
    "yellow",
    "orange",
    "purple",
    "pink",
    "brown",
    "black",
    "white",
    "gray",
    "grey",
    "lightgray",
    "lightgrey",
    "darkgray",
    "darkgrey",
    "cyan",
    "magenta",
    "lime",
    "maroon",
    "navy",
    "olive",
    "silver",
    "teal",
    "aqua",
    "fuchsia",
  ]

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
