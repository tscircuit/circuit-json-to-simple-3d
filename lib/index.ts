import type { CircuitJson } from "circuit-json"
import { cju } from "@tscircuit/circuit-json-util"
import { renderScene, type Box } from "@tscircuit/simple-3d-svg"

const degToRad = (d: number) => (d * Math.PI) / 180
import {
  getDefaultCameraForPcbBoard,
  type AnglePreset,
} from "./getDefaultCameraForPcbBoard"
import { convertCircuitJsonToPcbSvg } from "circuit-to-svg"
import type {
  Simple3dSvgOptions,
  BackgroundOptions,
  RenderSceneOptions,
} from "./types"
import { getColorFromBackgroundOptions } from "./utils/get-background-color-from-options"

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
      opts.defaultZoomMultiplier,
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

  const cadComponentsByPcbId = new Map<string, any[]>()
  for (const cad of db.cad_component.list()) {
    if (!cadComponentsByPcbId.has(cad.pcb_component_id)) {
      cadComponentsByPcbId.set(cad.pcb_component_id, [])
    }
    cadComponentsByPcbId.get(cad.pcb_component_id)!.push(cad)

    const pcbComp = db.pcb_component.get(cad.pcb_component_id)
    if (!pcbComp) continue
    const sourceComponent = db.source_component.get(cad.source_component_id)
    const size = cad.size ?? {
      x: pcbComp.width,
      y: DEFAULT_COMP_HEIGHT,
      z: pcbComp.height,
    }

    // We need to translate all the models from Y-up to Z-up
    const rotation = cad.rotation
      ? {
          x: degToRad(cad.rotation.x) - Math.PI / 2,
          y: degToRad(cad.rotation.z) + Math.PI,
          z: degToRad(cad.rotation.y),
        }
      : {
          x: 0,
          y: 0, // maybe Math.PI/4
          z: 0,
        }

    const box: Box = {
      center: {
        x: cad.position.x,
        y: cad.position.z,
        z: cad.position.y,
      },
      size,
      topLabel: sourceComponent?.name ?? "?",
      topLabelColor: "white",
    }

    if (cad.model_stl_url) {
      box.stlUrl = cad.model_stl_url
      box.stlRotation = rotation
    }
    if (cad.model_obj_url) {
      box.objUrl = cad.model_obj_url
      box.objRotation = rotation
    }

    boxes.push(box)
  }

  for (const comp of db.pcb_component.list()) {
    const cadList = cadComponentsByPcbId.get(comp.pcb_component_id) || []
    const hasModel = cadList.some((c) => c.model_stl_url || c.model_obj_url)
    if (hasModel) continue
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

  const backgroundColor = getColorFromBackgroundOptions(opts.background)

  const renderOptions: RenderSceneOptions = {
    backgroundColor,
  }

  if (opts.width) renderOptions.width = opts.width
  if (opts.height) renderOptions.height = opts.height

  return await renderScene({ boxes, camera }, renderOptions)
}

export type { Simple3dSvgOptions, BackgroundOptions, AnglePreset }
