import { test, expect } from "bun:test"
import usbCFlashlightCircuitJson from "./assets/usb-c-flashlight.json"
import { convertCircuitJsonToSimple3dSvg } from "lib"

test("backward compatibility existing options still work", async () => {
  const oldStyleOptions = await convertCircuitJsonToSimple3dSvg(
    usbCFlashlightCircuitJson as any,
    {
      anglePreset: "angle1",
    },
  )

  const emptyOptions = await convertCircuitJsonToSimple3dSvg(
    usbCFlashlightCircuitJson as any,
    {},
  )

  const customCamera = await convertCircuitJsonToSimple3dSvg(
    usbCFlashlightCircuitJson as any,
    {
      camera: {
        position: { x: 10, y: 15, z: 5 },
        lookAt: { x: 0, y: 0, z: 0 },
        focalLength: 2,
      },
    },
  )

  expect([
    oldStyleOptions,
    emptyOptions,
    customCamera,
  ]).toMatchMultipleSvgSnapshots(import.meta.path, [
    "old-style-options",
    "empty-options",
    "custom-camera",
  ])
})
