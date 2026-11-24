import { expect, test } from "bun:test"
import { convertCircuitJsonToSimple3dScene } from "lib"

test("bottom layer components are placed below the board", async () => {
  const circuitJson = [
    {
      type: "pcb_board",
      pcb_board_id: "pcb_board_0",
      width: 20,
      height: 10,
      thickness: 1.6,
      num_layers: 2,
      center: { x: 0, y: 0 },
      material: "fr4",
    },
    {
      type: "pcb_component",
      pcb_component_id: "pcb_component_top",
      source_component_id: "source_component_top",
      center: { x: -4, y: 0 },
      layer: "top",
      rotation: 0,
      width: 2,
      height: 1,
    },
    {
      type: "pcb_component",
      pcb_component_id: "pcb_component_bottom",
      source_component_id: "source_component_bottom",
      center: { x: 4, y: 0 },
      layer: "bottom",
      rotation: 0,
      width: 2,
      height: 1,
    },
  ]

  const scene = await convertCircuitJsonToSimple3dScene(circuitJson as any)
  const componentBoxes = scene.boxes.filter((box) => box.topLabel !== undefined)
  const topBox = componentBoxes.find((box) => box.center.x === -4)
  const bottomBox = componentBoxes.find((box) => box.center.x === 4)

  expect(topBox?.center.y).toBeCloseTo(1.3)
  expect(bottomBox?.center.y).toBeCloseTo(-1.3)
})
