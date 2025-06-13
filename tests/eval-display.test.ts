import { test, expect } from "bun:test"
import { runTscircuitCode } from "@tscircuit/eval"
import { convertCircuitJsonToSimple3dSvg } from "lib"

test("tscircuit eval display", async () => {
  const code = `import { usePushButton } from "@tsci/seveibar.push-button"
import { useUsbC } from "@tsci/seveibar.smd-usb-c"

export default () => {
  const USBC = useUsbC("USBC")
  const Button = usePushButton("SW1")
  return (
    <board width="12mm" height="30mm">
      <USBC
        GND1="net.GND"
        GND2="net.GND"
        VBUS1="net.VBUS"
        VBUS2="net.VBUS"
        pcbY={-10}
        schX={-4}
      />
      <led
        name="LED"
        supplierPartNumbers={{
          jlcpcb: ["965799"],
        }}
        color="red"
        footprint="0603"
        pcbY={12}
        schY={2}
      />
      <Button pcbY={0} pin2=".R1 > .pos" pin3="net.VBUS" schY={-2} />
      <resistor name="R1" footprint="0603" resistance="1k" pcbY={7} />

      <trace from=".R1 > .neg" to=".LED .pos" />
      <trace from=".LED .neg" to="net.GND" />
    </board>
  )
}
`

  const circuitJson = await runTscircuitCode(code)
  const svg = await convertCircuitJsonToSimple3dSvg(circuitJson as any)

  await expect(svg).toMatchSvgSnapshot(import.meta.path)
})
