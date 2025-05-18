import { test, expect } from "bun:test"
import usbCFlashlightCircuitJson from "./assets/usb-c-flashlight.json"
import { convertCircuitJsonToSimple3dSvg } from "lib"

test("usb-c-flashlight", () => {
  const svg = convertCircuitJsonToSimple3dSvg(usbCFlashlightCircuitJson)
  expect(svg).toMatchSvgSnapshot(import.meta.path)
})
