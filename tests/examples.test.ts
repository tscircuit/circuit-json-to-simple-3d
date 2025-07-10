import { test, expect } from "bun:test"
import usbCFlashlightCircuitJson from "./assets/usb-c-flashlight.json"
import { convertCircuitJsonToSimple3dSvg } from "lib"
import type { Simple3dSvgOptions } from "lib"

test("comprehensive examples - all new features", async () => {
  const basicUsage = await convertCircuitJsonToSimple3dSvg(
    usbCFlashlightCircuitJson as any,
  )

  const zoomExample: Simple3dSvgOptions = {
    anglePreset: "angle1",
    zoom: {
      defaultZoomMultiplier: 1.5,
    },
  }
  const zoomedSvg = await convertCircuitJsonToSimple3dSvg(
    usbCFlashlightCircuitJson as any,
    zoomExample,
  )

  const backgroundExample: Simple3dSvgOptions = {
    anglePreset: "angle2",
    background: {
      color: "#2c3e50",
      opacity: 0.9,
    },
  }
  const backgroundSvg = await convertCircuitJsonToSimple3dSvg(
    usbCFlashlightCircuitJson as any,
    backgroundExample,
  )

  const solidColorExample: Simple3dSvgOptions = {
    anglePreset: "left-raised",
    background: {
      color: "#3498db",
    },
  }
  const solidColorSvg = await convertCircuitJsonToSimple3dSvg(
    usbCFlashlightCircuitJson as any,
    solidColorExample,
  )

  const scalableExample: Simple3dSvgOptions = {
    anglePreset: "angle1",
    scalable: true,
    width: 800,
    height: 600,
    background: { color: "#ecf0f1" },
  }
  const scalableSvg = await convertCircuitJsonToSimple3dSvg(
    usbCFlashlightCircuitJson as any,
    scalableExample,
  )

  const advancedExample: Simple3dSvgOptions = {
    anglePreset: "angle1",
    zoom: {
      defaultZoomMultiplier: 2.2,
    },
    background: {
      color: "#6c757d",
      opacity: 0.8,
    },
    width: 800,
    height: 600,
    scalable: true,
  }
  const advancedSvg = await convertCircuitJsonToSimple3dSvg(
    usbCFlashlightCircuitJson as any,
    advancedExample,
  )

  expect([
    basicUsage,
    zoomedSvg,
    backgroundSvg,
    solidColorSvg,
    scalableSvg,
    advancedSvg,
  ]).toMatchMultipleSvgSnapshots(import.meta.path, [
    "basic-usage",
    "zoom-example",
    "background-example",
    "solid-color-example",
    "scalable-example",
    "advanced-example",
  ])
})

test("edge cases and error handling", async () => {
  const invalidZoomLevel = await convertCircuitJsonToSimple3dSvg(
    usbCFlashlightCircuitJson as any,
    {
      zoom: { defaultZoomMultiplier: -1 },
    },
  )

  const extremeZoom = await convertCircuitJsonToSimple3dSvg(
    usbCFlashlightCircuitJson as any,
    {
      zoom: { defaultZoomMultiplier: 100 },
    },
  )

  const invalidHexColor = await convertCircuitJsonToSimple3dSvg(
    usbCFlashlightCircuitJson as any,
    {
      background: { color: "invalid-color" },
    },
  )

  expect([
    invalidZoomLevel,
    extremeZoom,
    invalidHexColor,
  ]).toMatchMultipleSvgSnapshots(import.meta.path, [
    "invalid-zoom",
    "extreme-zoom",
    "invalid-color",
  ])
})

test("performance and optimization", async () => {
  const lowRes = await convertCircuitJsonToSimple3dSvg(
    usbCFlashlightCircuitJson as any,
    {
      width: 200,
      height: 150,
      zoom: { fitToView: true },
    },
  )

  const highRes = await convertCircuitJsonToSimple3dSvg(
    usbCFlashlightCircuitJson as any,
    {
      width: 1920,
      height: 1080,
      scalable: false,
      zoom: { defaultZoomMultiplier: 1.8 },
    },
  )

  expect([lowRes, highRes]).toMatchMultipleSvgSnapshots(import.meta.path, [
    "low-res",
    "high-res",
  ])
})
