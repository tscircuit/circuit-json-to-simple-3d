import { test, expect } from "bun:test"
import usbCFlashlightCircuitJson from "../assets/usb-c-flashlight.json"
import { convertCircuitJsonToSimple3dSvg } from "lib"
import type { Simple3dSvgOptions } from "lib"

test("comprehensive examples all new features", async () => {
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

  const dimensionExample: Simple3dSvgOptions = {
    anglePreset: "angle1",
    width: 800,
    height: 600,
    background: { color: "#ecf0f1" },
  }
  const dimensionSvg = await convertCircuitJsonToSimple3dSvg(
    usbCFlashlightCircuitJson as any,
    dimensionExample,
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
    dimensionSvg,
    advancedSvg,
  ]).toMatchMultipleSvgSnapshots(import.meta.path, [
    "basic-usage",
    "zoom-example",
    "background-example",
    "solid-color-example",
    "dimension-example",
    "advanced-example",
  ])
})
