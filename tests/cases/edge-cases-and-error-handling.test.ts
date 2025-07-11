import { test, expect } from "bun:test"
import usbCFlashlightCircuitJson from "../assets/usb-c-flashlight.json"
import { convertCircuitJsonToSimple3dSvg } from "lib"

test("edge cases and error handling", async () => {
  const invalidZoomLevel = await convertCircuitJsonToSimple3dSvg(
    usbCFlashlightCircuitJson as any,
    {
      zoom: { defaultZoomMultiplier: -1 },
    },
  )

  const invalidHexColor = await convertCircuitJsonToSimple3dSvg(
    usbCFlashlightCircuitJson as any,
    {
      background: { color: "invalid-color" },
    },
  )

  expect([invalidZoomLevel, invalidHexColor]).toMatchMultipleSvgSnapshots(
    import.meta.path,
    ["invalid-zoom", "extreme-zoom", "invalid-color"],
  )
})
