import { test, expect } from "bun:test"
import usbCFlashlightCircuitJson from "./assets/usb-c-flashlight.json"
import {
  convertCircuitJsonToSimple3dScene,
  convertCircuitJsonToSimple3dSvg,
} from "lib"

test("usb-c-flashlight", async () => {
  const angle1 = await convertCircuitJsonToSimple3dSvg(
    usbCFlashlightCircuitJson as any,
    {
      anglePreset: "angle1",
      showAxes: true,
      showOrigin: true,
      showGrid: true,
    },
  )
  const angle2 = await convertCircuitJsonToSimple3dSvg(
    usbCFlashlightCircuitJson as any,
    {
      anglePreset: "angle2",
      showAxes: true,
      showOrigin: true,
      showGrid: true,
    },
  )
  const left = await convertCircuitJsonToSimple3dSvg(
    usbCFlashlightCircuitJson as any,
    {
      anglePreset: "left",
      showAxes: true,
      showOrigin: true,
      showGrid: true,
    },
  )
  const right = await convertCircuitJsonToSimple3dSvg(
    usbCFlashlightCircuitJson as any,
    {
      anglePreset: "right",
      showAxes: true,
      showOrigin: true,
      showGrid: true,
    },
  )
  const leftRaised = await convertCircuitJsonToSimple3dSvg(
    usbCFlashlightCircuitJson as any,
    {
      anglePreset: "left-raised",
      showAxes: true,
      showOrigin: true,
      showGrid: true,
    },
  )
  expect([angle1, angle2, left, right, leftRaised]).toMatchMultipleSvgSnapshots(
    import.meta.path,
    ["angle1", "angle2", "left", "right", "left-raised"],
  )
})
