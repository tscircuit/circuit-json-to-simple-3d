import Color from "color"
import type { BackgroundOptions } from "../types"
import { isValidColor } from "./is-valid-color"

export function getColorFromBackgroundOptions(
  background?: BackgroundOptions,
): string {
  if (!background) return "lightgray"

  if (background.color) {
    if (background.opacity !== undefined) {
      try {
        const color = Color(background.color)
        const opacity = Math.max(0, Math.min(1, background.opacity))
        return color.alpha(opacity).string()
      } catch {
        return "lightgray"
      }
    }

    if (isValidColor(background.color)) {
      return background.color
    }

    return "lightgray"
  }

  return "lightgray"
}
