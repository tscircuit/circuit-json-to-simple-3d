# circuit-json-to-simple-3d

Convert Circuit JSON into a simplified 3d representation, suitable for visual
snapshot testing or inspecting prior to assembly.

![example 3d svg](./tests/__snapshots__/angle1.snap.svg)

## Usage

```ts
import { convertCircuitJsonToSimple3dSvg } from "circuit-json-to-simple-3d"

// Basic usage
convertCircuitJsonToSimple3dSvg(circuitJson)
// <svg>...</svg>

// With options
convertCircuitJsonToSimple3dSvg(circuitJson, {
  anglePreset: "angle1", // "angle1" | "angle2" | "left" | "right" | "left-raised" | "right-raised"
  zoom: {
    defaultZoomMultiplier: 1.5, // Zoom level multiplier
  },
  background: {
    color: "#ffffff", // CSS color value
    opacity: 0.8 // Opacity (0-1)
  },
  width: 800, // SVG width
  height: 600, // SVG height
})
```