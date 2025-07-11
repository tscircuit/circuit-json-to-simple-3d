import { test, expect } from "bun:test"
import usbCFlashlightCircuitJson from "../assets/usb-c-flashlight.json"
import { convertCircuitJsonToSimple3dSvg } from "lib"

test("combined options zoom with background", async () => {
  const zoomWithRedBg = await convertCircuitJsonToSimple3dSvg(
    usbCFlashlightCircuitJson as any,
    {
      anglePreset: "angle2",
      zoom: { defaultZoomMultiplier: 1.5 },
      background: { color: "#ff4444" },
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
