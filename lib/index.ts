import type { CircuitJson } from "circuit-json"
import { cju } from "@tscircuit/circuit-json-util"
import { renderScene, Box } from "@tscircuit/simple-3d-svg"

export function convertCircuitJsonToSimple3dSvg(
  circuitJson: CircuitJson,
  opts: {
    camera?: {
      position: { x: number; y: number; z: number }
      lookAt: { x: number; y: number; z: number }
      focalLength?: number
    }
  },
): string {
  const db = cju(circuitJson)
  const boxes: Box[] = []

  const pcbBoard = db.pcb_board.list()[0]

  if (!pcbBoard) throw new Error("No pcb_board, can't render to 3d")

  // TODO if camera not
  const camera = opts.camera ?? getDefaultCameraUsingPcbBoard(pcbBoard)
  if (!camera.focalLength) {
    camera.focalLength = 1
  }

  // TODO create box for pcb_board
  boxes.push({
    center: TODO,
    size: TODO,
  })

  const cadComponents = db.cad_component.list()

  // TODO create a box for each cad component

  return renderScene({ boxes, camera, backgroundColor: "white" })
}
