import type { PcbBoard, Point3 } from "circuit-json"
import type { Camera } from "@tscircuit/simple-3d-svg"

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
  defaultZoomMultiplier?: number,
): Camera {
  const w = pcbBoard.width
  const h = pcbBoard.height

  const cx = pcbBoard.center?.x || 0
  const cz = pcbBoard.center?.y || 0

  const boardSize = Math.max(w, h)
  let baseDist = boardSize * 1.5
  let effectiveZoomLevel: number | undefined

  if (defaultZoomMultiplier !== undefined) {
    if (defaultZoomMultiplier > 0) {
      effectiveZoomLevel = defaultZoomMultiplier
      baseDist = baseDist / effectiveZoomLevel
    }
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

  const focalLength = effectiveZoomLevel
    ? Math.max(1, 2 * effectiveZoomLevel)
    : 2

  return {
    position,
    lookAt: { x: cx, y: 0, z: cz },
    focalLength,
  }
}
