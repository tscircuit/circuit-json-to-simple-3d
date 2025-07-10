import type { PcbBoard, Point3 } from "circuit-json"
import type { Camera } from "@tscircuit/simple-3d-svg"
import type { ZoomOptions } from "./types"

export type AnglePreset =
  | "angle1"
  | "angle2"
  | "left"
  | "right"
  | "left-raised"
  | "right-raised"

export function getDefaultCameraForPcbBoard(
  pcbBoard: PcbBoard,
  anglePreset: AnglePreset = "angle1",
  zoomOptions?: ZoomOptions,
): Camera {
  const w = pcbBoard.width
  const h = pcbBoard.height

  const cx = pcbBoard.center?.x || 0
  const cz = pcbBoard.center?.y || 0

  let baseDist = Math.max(w, h) * 1.5
  let effectiveZoomLevel: number | undefined

  // Validate and apply zoom level
  if (zoomOptions?.defaultZoomMultiplier !== undefined) {
    // Only use valid positive zoom levels
    if (zoomOptions.defaultZoomMultiplier > 0) {
      effectiveZoomLevel = zoomOptions.defaultZoomMultiplier
      baseDist = baseDist / effectiveZoomLevel
    }
    // If zoom level is invalid (negative or zero), ignore it and use default
  }

  // Handle fitToView option (overrides zoom level but uses better calculation)
  if (zoomOptions?.fitToView) {
    // Better fit calculation that considers board dimensions
    const boardSize = Math.max(w, h)
    baseDist = boardSize * 1.2 // Closer than 1.5 but not too close like 0.8
    effectiveZoomLevel = 1.25 // Set a reasonable zoom level for fit to view
  }

  const dist = baseDist

  let position: Point3
  if (anglePreset === "angle1") {
    position = { x: cx - dist, y: dist, z: cz - dist }
  } else if (anglePreset === "angle2") {
    position = { x: cx + dist, y: dist, z: cz - dist }
  } else if (anglePreset === "left") {
    position = { x: cx - dist, y: 0, z: cz }
  } else if (anglePreset === "right") {
    position = { x: cx + dist, y: 0, z: cz }
  } else if (anglePreset === "left-raised") {
    position = { x: cx - dist, y: dist, z: cz }
  } else if (anglePreset === "right-raised") {
    position = { x: cx + dist, y: dist, z: cz }
  } else {
    throw new Error(`Unknown angle preset: ${anglePreset}`)
  }

  // Use effective zoom level for focal length calculation
  const focalLength = effectiveZoomLevel ? Math.max(1, 2 * effectiveZoomLevel) : 2

  return {
    position,
    lookAt: { x: cx, y: 0, z: cz },
    focalLength,
  }
}
