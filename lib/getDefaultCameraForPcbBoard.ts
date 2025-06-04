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
): Camera {
  const w = pcbBoard.width
  const h = pcbBoard.height

  const cx = pcbBoard.center?.x
  const cz = pcbBoard.center?.y // pcb y → renderer z

  const dist = Math.max(w, h) * 1.5 * 10

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

  return {
    position,
    lookAt: { x: cx, y: 0, z: cz },
    focalLength: 20,
  }
}
