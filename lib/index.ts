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
  RenderSceneOptions,
} from "./types"
import { getColorFromBackgroundOptions } from "./utils/get-background-color"

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

  const backgroundColor = getColorFromBackgroundOptions(opts.background)

  const renderOptions: RenderSceneOptions = {
    backgroundColor,
  }

  if (opts.width) renderOptions.width = opts.width
  if (opts.height) renderOptions.height = opts.height

  return await renderScene({ boxes, camera }, renderOptions)
}

export type { Simple3dSvgOptions, BackgroundOptions, ZoomOptions, AnglePreset }
