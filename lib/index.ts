import type { CircuitJson } from "circuit-json"
import { cju } from "@tscircuit/circuit-json-util"
import { renderScene, type Box } from "@tscircuit/simple-3d-svg"
import {
  getDefaultCameraForPcbBoard,
  type AnglePreset,
} from "./getDefaultCameraForPcbBoard"
import { convertCircuitJsonToPcbSvg } from "circuit-to-svg"
import type {
  Simple3dSvgOptions,
  BackgroundOptions,
  ZoomOptions,
} from "./types"

function processBackgroundOptions(background?: BackgroundOptions): string {
  if (!background) return "lightgray"

  if (background.color) {
    // Check if it's a valid color format
    const colorStr = background.color.toLowerCase()

    // Handle hex colors with opacity
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

        // Validate hex characters
        if (/^[0-9a-f]{6}$/i.test(hex)) {
          const r = parseInt(hex.substr(0, 2), 16)
          const g = parseInt(hex.substr(2, 2), 16)
          const b = parseInt(hex.substr(4, 2), 16)
          const opacity = Math.max(0, Math.min(1, background.opacity))
          return `rgba(${r}, ${g}, ${b}, ${opacity})`
        }
      }
      // If opacity is specified but color is invalid, fall back to default
      return "lightgray"
    }

    // Validate color without opacity
    if (isValidColor(background.color)) {
      return background.color
    }

    // If color is invalid, fall back to default
    return "lightgray"
  }

  return "lightgray"
}

// Helper function to validate color formats
function isValidColor(color: string): boolean {
  const colorStr = color.toLowerCase()

  // Check hex colors
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

  // Check for common CSS color names
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

  // Check rgb/rgba format
  if (colorStr.startsWith("rgb(") || colorStr.startsWith("rgba(")) {
    return /^rgba?\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*(,\s*[\d.]+\s*)?\)$/i.test(
      colorStr,
    )
  }

  // If none of the above, consider it invalid
  return false
}

export async function convertCircuitJsonToSimple3dSvg(
  circuitJson: CircuitJson,
  opts: Simple3dSvgOptions = {},
): Promise<string> {
  const db = cju(circuitJson)
  const boxes: Box[] = []

  const pcbTopSvg = convertCircuitJsonToPcbSvg(circuitJson, {
    layer: "top",
    matchBoardAspectRatio: true,
    backgroundColor: "transparent",
    drawPaddingOutsideBoard: false,
    colorOverrides: {
      copper: {
        top: "#ffe066",
        bottom: "#ffe066",
      },
      drill: "rgba(0,0,0,0.5)",
    },
  }).replace("<svg", "<svg transform='scale(1, -1)'")

  const pcbBoard = db.pcb_board.list()[0]

  if (!pcbBoard) throw new Error("No pcb_board, can't render to 3d")

  const camera =
    opts.camera ??
    getDefaultCameraForPcbBoard(
      pcbBoard,
      opts.anglePreset ?? "angle1",
      opts.zoom,
    )
  if (!camera.focalLength) {
    camera.focalLength = 1
  }

  boxes.push({
    center: {
      x: pcbBoard.center.x,
      y: 0,
      z: pcbBoard.center.y,
    },
    size: {
      x: pcbBoard.width,
      y: pcbBoard.thickness,
      z: pcbBoard.height,
    },
    faceImages: {
      top: `data:image/svg+xml;base64,${btoa(pcbTopSvg)}`,
    },
    projectionSubdivision: 10,
    color: "rgba(0,140,0,0.8)",
  })

  const DEFAULT_COMP_HEIGHT = 2

  for (const comp of db.pcb_component.list()) {
    const sourceComponent = db.source_component.get(comp.source_component_id)
    const compHeight = Math.min(
      Math.min(comp.width, comp.height),
      DEFAULT_COMP_HEIGHT,
    )
    boxes.push({
      center: {
        x: comp.center.x,
        y: pcbBoard.thickness / 2 + compHeight / 2,
        z: comp.center.y,
      },
      size: {
        x: comp.width,
        y: compHeight,
        z: comp.height,
      },
      color: "rgba(128,128,128,0.5)",
      topLabel: sourceComponent?.name ?? "?",
      topLabelColor: "white",
    })
  }

  const backgroundColor = processBackgroundOptions(opts.background)

  const renderOptions: any = {
    backgroundColor,
  }

  if (opts.width) renderOptions.width = opts.width
  if (opts.height) renderOptions.height = opts.height
  if (opts.scalable !== undefined) renderOptions.scalable = opts.scalable

  return await renderScene({ boxes, camera }, renderOptions)
}

export type { Simple3dSvgOptions, BackgroundOptions, ZoomOptions, AnglePreset }
