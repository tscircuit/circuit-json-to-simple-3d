import { expect, test } from "bun:test"
import { convertCircuitJsonToSimple3dScene } from "lib"

test("unicode silkscreen does not throw when encoding the board face SVG", async () => {
  const scene = await convertCircuitJsonToSimple3dScene([
    {
      type: "pcb_board",
      pcb_board_id: "board-1",
      width: 20,
      height: 12,
      thickness: 1.6,
      center: { x: 0, y: 0 },
    } as any,
    {
      type: "pcb_silkscreen_text",
      pcb_silkscreen_text_id: "silk-1",
      text: "Ω μA 温度",
      anchor_position: { x: 0, y: 0 },
      font_size: 1.2,
      layer: "top",
      ccw_rotation: 0,
    } as any,
  ])

  const boardFace = scene.boxes.find((box) => box.faceImages?.top)
  expect(boardFace?.faceImages?.top).toStartWith("data:image/svg+xml;base64,")
  const encoded = boardFace!.faceImages!.top!.split(",")[1]!
  const svg = Buffer.from(encoded, "base64").toString("utf8")
  expect(svg).toContain("Ω")
  expect(svg).toContain("温度")
})
