import type { CircuitJson } from "circuit-json"
import { cju } from "@tscircuit/circuit-json-util"
import { renderScene, type Box } from "@tscircuit/simple-3d-svg"
import { getDefaultCameraForPcbBoard } from "./getDefaultCameraForPcbBoard"

export function convertCircuitJsonToSimple3dSvg(
  circuitJson: CircuitJson,
  opts: {
    camera?: {
      position: { x: number; y: number; z: number }
      lookAt: { x: number; y: number; z: number }
      focalLength?: number
    }
  } = {},
): string {
  const db = cju(circuitJson)
  const boxes: Box[] = []

  const pcbBoard = db.pcb_board.list()[0]

  if (!pcbBoard) throw new Error("No pcb_board, can't render to 3d")

  // TODO if camera not
  const camera = opts.camera ?? getDefaultCameraForPcbBoard(pcbBoard)
  if (!camera.focalLength) {
    camera.focalLength = 1
  }

  // pcb board as a thin green box lying in the X-Z plane
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
    color: "rgba(0,140,0,0.8)",
  })

  const DEFAULT_COMP_HEIGHT = 2 // mm – arbitrary extrusion for components

  for (const comp of db.pcb_component.list()) {
    const sourceComponent = db.source_component.get(comp.source_component_id)
    boxes.push({
      center: {
        x: comp.center.x,
        y: pcbBoard.thickness / 2 + DEFAULT_COMP_HEIGHT / 2,
        z: comp.center.y,
      },
      size: {
        x: comp.width,
        y: Math.min(Math.min(comp.width, comp.height), DEFAULT_COMP_HEIGHT),
        z: comp.height,
      },
      color: "rgba(128,128,128,0.9)",
      topLabel: sourceComponent?.name ?? "?",
      topLabelColor: "white",
    })
  }

  return renderScene(
    { boxes, camera },
    {
      backgroundColor: "lightgray",
    },
  )
}
