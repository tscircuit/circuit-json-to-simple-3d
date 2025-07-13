import { test, expect } from "bun:test"
import usbCFlashlightCircuitJson from "./assets/usb-c-flashlight.json"
import { convertCircuitJsonToSimple3dSvg } from "lib"

test("usb-c-flashlight", async () => {
  const angle1 = await convertCircuitJsonToSimple3dSvg(
    usbCFlashlightCircuitJson as any,
    {
      anglePreset: "angle1",
    },
  )
  // const svg2 = await convertCircuitJsonToSimple3dSvg(
  //   usbCFlashlightCircuitJson as any,
  //   {
  //     anglePreset: "angle2",
  //   },
  // )
  // const svg3 = await convertCircuitJsonToSimple3dSvg(
  //   usbCFlashlightCircuitJson as any,
  //   {
  //     anglePreset: "left",
  //   },
  // )
  // const svg4 = await convertCircuitJsonToSimple3dSvg(
  //   usbCFlashlightCircuitJson as any,
  //   {
  //     anglePreset: "right",
  //   },
  // )
  // const svg5 = await convertCircuitJsonToSimple3dSvg(
  //   usbCFlashlightCircuitJson as any,
  //   {
  //     anglePreset: "left-raised",
  //   },
  // )
  expect([angle1 /**, svg2, svg3, svg4, svg5 **/]).toMatchMultipleSvgSnapshots(
    import.meta.path,
    ["angle1"], // , "angle2", "left", "right", "left-raised"],
  )
})
