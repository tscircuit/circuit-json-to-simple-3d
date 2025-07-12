import { test, expect } from "bun:test"
import usbCFlashlightCircuitJson from "./assets/usb-c-flashlight.json"
import { convertCircuitJsonToSimple3dSvg } from "lib"

test("zoom options different zoom levels", async () => {
  const zoomLevel1 = await convertCircuitJsonToSimple3dSvg(
    usbCFlashlightCircuitJson as any,
    {
      anglePreset: "angle1",
      defaultZoomMultiplier: 1,
    },
  )

  const zoomLevel2 = await convertCircuitJsonToSimple3dSvg(
    usbCFlashlightCircuitJson as any,
    {
      anglePreset: "angle1",
      defaultZoomMultiplier: 2,
    },
  )

  const zoomLevel05 = await convertCircuitJsonToSimple3dSvg(
    usbCFlashlightCircuitJson as any,
    {
      anglePreset: "angle1",
      defaultZoomMultiplier: 0.5,
    },
  )

  expect([zoomLevel1, zoomLevel2, zoomLevel05]).toMatchMultipleSvgSnapshots(
    import.meta.path,
    ["zoom-1x", "zoom-2x", "zoom-0.5x"],
  )
})
