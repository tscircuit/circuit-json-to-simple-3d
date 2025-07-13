import { test, expect } from "bun:test"
import usbCFlashlightCircuitJson from "../assets/usb-c-flashlight.json"
import { convertCircuitJsonToSimple3dSvg } from "lib"

test("background color options solid colors", async () => {
  const redBackground = await convertCircuitJsonToSimple3dSvg(
    usbCFlashlightCircuitJson as any,
    {
      anglePreset: "angle1",
      background: { color: "#ff0000" },
    },
  )

  const blueBackground = await convertCircuitJsonToSimple3dSvg(
    usbCFlashlightCircuitJson as any,
    {
      anglePreset: "angle1",
      background: { color: "#0000ff" },
    },
  )

  const transparentBackground = await convertCircuitJsonToSimple3dSvg(
    usbCFlashlightCircuitJson as any,
    {
      anglePreset: "angle1",
      background: { color: "#ffffff", opacity: 0.5 },
    },
  )

  expect([
    redBackground,
    blueBackground,
    transparentBackground,
  ]).toMatchMultipleSvgSnapshots(import.meta.path, [
    "red-background",
    "blue-background",
    "transparent-background",
  ])
})
