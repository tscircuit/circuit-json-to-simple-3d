import { test, expect } from "bun:test"
import usbCFlashlightCircuitJson from "../assets/usb-c-flashlight.json"
import { convertCircuitJsonToSimple3dSvg } from "lib"

test("dimension options", async () => {
  const largeSize = await convertCircuitJsonToSimple3dSvg(
    usbCFlashlightCircuitJson as any,
    {
      anglePreset: "angle1",
      width: 800,
      height: 600,
    },
  )

  const smallSize = await convertCircuitJsonToSimple3dSvg(
    usbCFlashlightCircuitJson as any,
    {
      anglePreset: "angle1",
      width: 400,
      height: 300,
    },
  )

  expect([largeSize, smallSize]).toMatchMultipleSvgSnapshots(import.meta.path, [
    "large-size",
    "small-size",
  ])
})
