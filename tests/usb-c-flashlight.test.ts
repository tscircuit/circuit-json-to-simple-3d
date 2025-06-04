import { test, expect } from "bun:test"
import usbCFlashlightCircuitJson from "./assets/usb-c-flashlight.json"
import { convertCircuitJsonToSimple3dSvg } from "lib"

test("usb-c-flashlight", async () => {
  const svg1 = await convertCircuitJsonToSimple3dSvg(
    usbCFlashlightCircuitJson as any,
    {
      anglePreset: "angle1",
    },
  )
  const svg2 = await convertCircuitJsonToSimple3dSvg(
    usbCFlashlightCircuitJson as any,
    {
      anglePreset: "angle2",
    },
  )
  const svg3 = await convertCircuitJsonToSimple3dSvg(
    usbCFlashlightCircuitJson as any,
    {
      anglePreset: "left",
    },
  )
  const svg4 = await convertCircuitJsonToSimple3dSvg(
    usbCFlashlightCircuitJson as any,
    {
      anglePreset: "right",
    },
  )
  expect(svg1).toMatchSvgSnapshot("flashlight-angle1")
  expect(svg2).toMatchSvgSnapshot("flashlight-angle2")
  expect(svg3).toMatchSvgSnapshot("flashlight-left")
  expect(svg4).toMatchSvgSnapshot("flashlight-right")
})
