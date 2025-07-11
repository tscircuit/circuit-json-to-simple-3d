import { test, expect } from "bun:test"
import usbCFlashlightCircuitJson from "../assets/usb-c-flashlight.json"
import { convertCircuitJsonToSimple3dSvg } from "lib"

test("different resolution rendering", async () => {
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
      zoom: { defaultZoomMultiplier: 1.8 },
    },
  )

  expect([lowRes, highRes]).toMatchMultipleSvgSnapshots(import.meta.path, [
    "low-res",
    "high-res",
  ])
})
