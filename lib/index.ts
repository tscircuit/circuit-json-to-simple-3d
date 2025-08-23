import type { CircuitJson } from "circuit-json"
import type { CadComponent } from "circuit-json"
import { cju } from "@tscircuit/circuit-json-util"
import { renderScene, type Box, type Camera } from "@tscircuit/simple-3d-svg"
import {
  getDefaultCameraForPcbBoard,
  type AnglePreset,
} from "./getDefaultCameraForPcbBoard"
import { getDefaultCameraForComponents } from "./getDefaultCameraForComponents"
import { convertCircuitJsonToPcbSvg } from "circuit-to-svg"
import type {
  Simple3dSvgOptions,
  BackgroundOptions,
  RenderSceneOptions,
} from "./types"
import { getColorFromBackgroundOptions } from "./utils/get-background-color-from-options"

const convertRotationFromCadRotation = (rot: {
  x: number
  y: number
  z: number
}) => {
  return {
    x: (rot.x * Math.PI) / 180 - Math.PI / 2,
    y: (rot.y * Math.PI) / 180,
    z: (rot.z * Math.PI) / 180,
  }
}

export async function convertCircuitJsonToSimple3dScene(
  circuitJson: CircuitJson,
  opts: Simple3dSvgOptions = {},
): Promise<{ boxes: Box[]; camera: any }> {
  const db = cju(circuitJson)
  const boxes: Box[] = []

  // ---------------------------------------------------------------------------
  // Essential board-level constants – needed before we create any Box objects
  // ---------------------------------------------------------------------------
  const pcbBoard = db.pcb_board.list()[0]

  // Default extrusion (height) for generic PCB components / fallback cubes
  const DEFAULT_COMP_HEIGHT = 2

  // Default board thickness for when there's no PCB board
  const DEFAULT_BOARD_THICKNESS = 1.4

  // ---------------------------------------------------------------------------
  // Add 3-D CAD models (STL / OBJ) that are described by cad_component records
  // ---------------------------------------------------------------------------
  const cadComponents: CadComponent[] = (db.cad_component?.list?.() ??
    []) as any
  const pcbComponentIdsWith3d = new Set<string>()

  for (const cad of cadComponents) {
    const { model_stl_url, model_obj_url } = cad
    if (!model_stl_url && !model_obj_url) continue // nothing we can render

    // Remember which pcb_component already has a 3-D model so we can skip the
    // generic "gray cube" later
    pcbComponentIdsWith3d.add(cad.pcb_component_id)

    // Size – prefer the one given on the cad_component, otherwise fall back to
    // the pcb_component footprint, finally to a small default cube
    const pcbComp = db.pcb_component.get(cad.pcb_component_id)
    const DEFAULT_SIZE = 2
    const size =
      cad.size ??
      (pcbComp
        ? { x: pcbComp.width, y: DEFAULT_COMP_HEIGHT, z: pcbComp.height }
        : { x: DEFAULT_SIZE, y: DEFAULT_SIZE, z: DEFAULT_SIZE })

    // Position – use the explicit 3-D position when provided, otherwise put the
    // model on top of the PCB at the pcb_component centre
    const boardThickness = pcbBoard?.thickness ?? DEFAULT_BOARD_THICKNESS
    const center = cad.position
      ? { x: cad.position.x, y: cad.position.z, z: cad.position.y }
      : {
          x: pcbComp?.center.x ?? 0,
          y: boardThickness / 2 + size.y / 2,
          z: pcbComp?.center.y ?? 0,
        }

    boxes.push({
      center,
      size,
      color: !(model_obj_url || model_stl_url)
        ? "rgba(128,128,128,0.5)"
        : undefined, // used only when model fails to load
      // STL / OBJ support
      ...(model_stl_url
        ? {
            stlUrl: model_stl_url,
            scaleStlToBox: false,
            centerModel: true,
            drawBoundingBox: opts.showBoundingBoxes ?? false,
          }
        : {}),
      ...(model_obj_url
        ? {
            objUrl: model_obj_url,
            scaleObjToBox: false,
            centerModel: true,
            drawBoundingBox: opts.showBoundingBoxes ?? false,
          }
        : {}),
      // Forward any explicit rotation/position overrides from the CAD record
      ...(cad.rotation
        ? {
            // stlRotation: convertRotation(cad.rotation),
            objRotation: convertRotationFromCadRotation(cad.rotation),
          }
        : {}),
    } satisfies Box)
  }

  let camera: Camera | undefined = opts.camera

  if (!camera) {
    if (pcbBoard) {
      camera = getDefaultCameraForPcbBoard(
        pcbBoard,
        opts.anglePreset ?? "angle1",
        opts.defaultZoomMultiplier,
      )
    } else {
      // Use component-based camera for standalone components
      const pcbComponents = db.pcb_component.list()
      camera = getDefaultCameraForComponents(
        pcbComponents,
        opts.anglePreset ?? "angle1",
        opts.defaultZoomMultiplier,
      )
    }
  }

  if (!camera.focalLength) {
    camera.focalLength = 1
  }

  if (pcbBoard) {
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
  }

  for (const comp of db.pcb_component.list()) {
    if (pcbComponentIdsWith3d.has(comp.pcb_component_id)) continue
    const sourceComponent = db.source_component.get(comp.source_component_id)
    const compHeight = Math.min(
      Math.min(comp.width, comp.height),
      DEFAULT_COMP_HEIGHT,
    )
    const boardThickness = pcbBoard?.thickness ?? DEFAULT_BOARD_THICKNESS
    boxes.push({
      center: {
        x: comp.center.x,
        y: boardThickness / 2 + compHeight / 2,
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

  return { boxes, camera }
}

export async function convertCircuitJsonToSimple3dSvg(
  circuitJson: CircuitJson,
  opts: Simple3dSvgOptions = {},
): Promise<string> {
  const backgroundColor = getColorFromBackgroundOptions(opts.background)

  const renderOptions: RenderSceneOptions = {
    backgroundColor,
    showGrid: opts.showGrid ?? false,
    showOrigin: opts.showOrigin ?? false,
    showAxes: opts.showAxes ?? false,
  }

  if (opts.width) renderOptions.width = opts.width
  if (opts.height) renderOptions.height = opts.height

  const scene = await convertCircuitJsonToSimple3dScene(circuitJson, opts)

  return await renderScene(scene, {
    ...renderOptions,
  })
}

export type { Simple3dSvgOptions, BackgroundOptions, AnglePreset }
