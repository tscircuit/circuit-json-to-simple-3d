import { test, expect } from "bun:test"
import chipWithoutBoardCircuitJson from "./assets/chip-without-board.json"
import {
  convertCircuitJsonToSimple3dScene,
  convertCircuitJsonToSimple3dSvg,
} from "lib"

test("chip-without-board", async () => {
  const angle1 = await convertCircuitJsonToSimple3dSvg(
    chipWithoutBoardCircuitJson as any,
    {
      anglePreset: "angle1",
      showAxes: true,
      showOrigin: true,
      showGrid: true,
    },
  )

  expect(angle1).toMatchSvgSnapshot(import.meta.path)
})
