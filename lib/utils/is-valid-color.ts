import Color from "color"

export const isValidColor = (color: string): boolean => {
  try {
    Color(color)
    return true
  } catch {
    return false
  }
}

if (import.meta.main) {
  console.log(Color("color"))
}
