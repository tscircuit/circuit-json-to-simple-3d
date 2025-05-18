import type { PcbBoard } from "circuit-json"
import type { Camera } from "@tscircuit/simple-3d-svg"

export function getDefaultCameraForPcbBoard(pcbBoard: PcbBoard): Camera {
  const w = pcbBoard.width
  const h = pcbBoard.height

  const cx = pcbBoard.center?.x
  const cz = pcbBoard.center?.y // pcb y → renderer z

  const dist = Math.max(w, h) * 1.5

  return {
    position: { x: cx - dist, y: dist, z: cz - dist },
    lookAt: { x: cx, y: 0, z: cz },
    focalLength: 2,
  }
}
