import Color from "color"
import type { BackgroundOptions } from "../types"
import { isValidColor } from "./is-valid-color"

export function getColorFromBackgroundOptions(
  background?: BackgroundOptions,
): string {
  if (!background) return "white"

  if (background.color) {
    if (background.opacity !== undefined) {
      try {
        const color = Color(background.color)
        const opacity = Math.max(0, Math.min(1, background.opacity))
        return color.alpha(opacity).string()
      } catch {
        return "white"
      }
    }

    if (isValidColor(background.color)) {
      return background.color
    }

    return "white"
  }

  return "white"
}
