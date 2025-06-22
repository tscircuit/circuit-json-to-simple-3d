# circuit-json-to-simple-3d

Convert Circuit JSON into a simplified 3d representation, suitable for visual
snapshot testing or inspecting prior to assembly.

![example 3d svg](./tests/__snapshots__/angle1.snap.svg)

## Usage

```ts
import { convertCircuitJsonToSimple3dSvg } from "circuit-json-to-simple-3d"

convertCircuitJsonToSimple3dSvg(circuitJson)
// <svg>...</svg>
```
