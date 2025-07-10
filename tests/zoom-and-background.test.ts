import { test, expect } from "bun:test"
import usbCFlashlightCircuitJson from "./assets/usb-c-flashlight.json"
import { convertCircuitJsonToSimple3dSvg } from "lib"

test("zoom options - different zoom levels", async () => {
  const zoomLevel1 = await convertCircuitJsonToSimple3dSvg(
    usbCFlashlightCircuitJson as any,
    {
      anglePreset: "angle1",
      zoom: { defaultZoomMultiplier: 1 },
    },
  )

  const zoomLevel2 = await convertCircuitJsonToSimple3dSvg(
    usbCFlashlightCircuitJson as any,
    {
      anglePreset: "angle1",
      zoom: { defaultZoomMultiplier: 2 },
    },
  )

  const zoomLevel05 = await convertCircuitJsonToSimple3dSvg(
    usbCFlashlightCircuitJson as any,
    {
      anglePreset: "angle1",
      zoom: { defaultZoomMultiplier: 0.5 },
    },
  )

  const fitToView = await convertCircuitJsonToSimple3dSvg(
    usbCFlashlightCircuitJson as any,
    {
      anglePreset: "angle1",
      zoom: { fitToView: true },
    },
  )

  expect([
    zoomLevel1,
    zoomLevel2,
    zoomLevel05,
    fitToView,
  ]).toMatchMultipleSvgSnapshots(import.meta.path, [
    "zoom-1x",
    "zoom-2x",
    "zoom-0.5x",
    "fit-to-view",
  ])
})

test("background color options - solid colors", async () => {
  const redBackground = await convertCircuitJsonToSimple3dSvg(
    usbCFlashlightCircuitJson as any,
    {
      anglePreset: "angle1",
      background: { color: "#ff0000" },
    },
  )

  const blueBackground = await convertCircuitJsonToSimple3dSvg(
    usbCFlashlightCircuitJson as any,
    {
      anglePreset: "angle1",
      background: { color: "#0000ff" },
    },
  )

  const transparentBackground = await convertCircuitJsonToSimple3dSvg(
    usbCFlashlightCircuitJson as any,
    {
      anglePreset: "angle1",
      background: { color: "#ffffff", opacity: 0.5 },
    },
  )

  expect([
    redBackground,
    blueBackground,
    transparentBackground,
  ]).toMatchMultipleSvgSnapshots(import.meta.path, [
    "red-background",
    "blue-background",
    "transparent-background",
  ])
})

test("scalable SVG options", async () => {
  const scalableTrue = await convertCircuitJsonToSimple3dSvg(
    usbCFlashlightCircuitJson as any,
    {
      anglePreset: "angle1",
      scalable: true,
      width: 800,
      height: 600,
    },
  )

  const scalableFalse = await convertCircuitJsonToSimple3dSvg(
    usbCFlashlightCircuitJson as any,
    {
      anglePreset: "angle1",
      scalable: false,
      width: 400,
      height: 300,
    },
  )

  expect([scalableTrue, scalableFalse]).toMatchMultipleSvgSnapshots(
    import.meta.path,
    ["scalable-true", "scalable-false"],
  )
})

test("combined options - zoom with background", async () => {
  const zoomWithRedBg = await convertCircuitJsonToSimple3dSvg(
    usbCFlashlightCircuitJson as any,
    {
      anglePreset: "angle2",
      zoom: { defaultZoomMultiplier: 1.5 },
      background: { color: "#ff4444" },
      scalable: true,
    },
  )

  const fitToViewWithSolidBg = await convertCircuitJsonToSimple3dSvg(
    usbCFlashlightCircuitJson as any,
    {
      anglePreset: "left-raised",
      zoom: { fitToView: true },
      background: { color: "#87CEEB", opacity: 0.8 },
      width: 600,
      height: 400,
    },
  )

  expect([zoomWithRedBg, fitToViewWithSolidBg]).toMatchMultipleSvgSnapshots(
    import.meta.path,
    ["zoom-with-red-bg", "fit-to-view-with-solid-bg"],
  )
})

test("backward compatibility - existing options still work", async () => {
  const oldStyleOptions = await convertCircuitJsonToSimple3dSvg(
    usbCFlashlightCircuitJson as any,
    {
      anglePreset: "angle1",
    },
  )

  const emptyOptions = await convertCircuitJsonToSimple3dSvg(
    usbCFlashlightCircuitJson as any,
    {},
  )

  const customCamera = await convertCircuitJsonToSimple3dSvg(
    usbCFlashlightCircuitJson as any,
    {
      camera: {
        position: { x: 10, y: 15, z: 5 },
        lookAt: { x: 0, y: 0, z: 0 },
        focalLength: 2,
      },
    },
  )

  expect([
    oldStyleOptions,
    emptyOptions,
    customCamera,
  ]).toMatchMultipleSvgSnapshots(import.meta.path, [
    "old-style-options",
    "empty-options",
    "custom-camera",
  ])
})
