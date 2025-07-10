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

  const cx = pcbBoard.center?.x
  const cz = pcbBoard.center?.y

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

  // Handle fitToView option (overrides zoom level)
  if (zoomOptions?.fitToView) {
    baseDist = Math.max(w, h) * 0.8
    effectiveZoomLevel = 1 // Set a reasonable default for focal length calculation
  }

  const dist = baseDist

  let position: Point3
  if (anglePreset === "angle1") {
    position = { x: cx - dist, y: dist, z: cz - dist }
  } else if (anglePreset === "angle2") {
    position = { x: cx + dist, y: dist, z: cz - dist }
  } else if (anglePreset === "left") {
    position = { x: cx - dist, y: 0, z: 0 }
  } else if (anglePreset === "right") {
    position = { x: cx + dist, y: 0, z: 0 }
  } else if (anglePreset === "left-raised") {
    position = { x: cx - dist, y: dist, z: 0 }
  } else if (anglePreset === "right-raised") {
    position = { x: cx + dist, y: dist, z: 0 }
  } else {
    throw new Error(`Unknown angle preset: ${anglePreset}`)
  }

  // Use effective zoom level for focal length, default to 2 if no valid zoom
  const focalLength = effectiveZoomLevel ? 2 * effectiveZoomLevel : 2

  return {
    position,
    lookAt: { x: cx, y: 0, z: cz },
    focalLength,
  }
}
