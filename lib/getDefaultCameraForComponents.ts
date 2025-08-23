import type { PcbComponent, Point3 } from "circuit-json"
import type { Camera } from "@tscircuit/simple-3d-svg"
import type { AnglePreset } from "./getDefaultCameraForPcbBoard"

export function getDefaultCameraForComponents(
  components: PcbComponent[],
  anglePreset: AnglePreset = "angle1",
  defaultZoomMultiplier?: number,
): Camera {
  if (components.length === 0) {
    // Default fallback camera for empty component list
    return {
      position: { x: 10, y: 10, z: 10 },
      lookAt: { x: 0, y: 0, z: 0 },
      focalLength: 2,
    }
  }

  // Calculate bounding box of all components
  let minX = Number.POSITIVE_INFINITY
  let maxX = Number.NEGATIVE_INFINITY
  let minZ = Number.POSITIVE_INFINITY
  let maxZ = Number.NEGATIVE_INFINITY

  for (const comp of components) {
    const halfWidth = comp.width / 2
    const halfHeight = comp.height / 2

    minX = Math.min(minX, comp.center.x - halfWidth)
    maxX = Math.max(maxX, comp.center.x + halfWidth)
    minZ = Math.min(minZ, comp.center.y - halfHeight)
    maxZ = Math.max(maxZ, comp.center.y + halfHeight)
  }

  // Calculate center and size of components
  const cx = (minX + maxX) / 2
  const cz = (minZ + maxZ) / 2
  const w = maxX - minX
  const h = maxZ - minZ

  const componentSize = Math.max(w, h, 5) // Minimum size of 5 to prevent too close camera
  let baseDist = componentSize * 1.5
  let effectiveZoomLevel: number | undefined

  if (defaultZoomMultiplier !== undefined) {
    if (defaultZoomMultiplier > 0) {
      effectiveZoomLevel = defaultZoomMultiplier
      baseDist = baseDist / effectiveZoomLevel
    }
  }

  const dist = baseDist

  let position: Point3
  if (anglePreset === "angle1") {
    position = { x: cx - dist, y: dist, z: cz - dist }
  } else if (anglePreset === "angle2") {
    position = { x: cx + dist, y: dist, z: cz - dist }
  } else if (anglePreset === "left") {
    position = { x: cx - dist, y: 0, z: cz }
  } else if (anglePreset === "right") {
    position = { x: cx + dist, y: 0, z: cz }
  } else if (anglePreset === "left-raised") {
    position = { x: cx - dist, y: dist, z: cz }
  } else if (anglePreset === "right-raised") {
    position = { x: cx + dist, y: dist, z: cz }
  } else {
    throw new Error(`Unknown angle preset: ${anglePreset}`)
  }

  const focalLength = effectiveZoomLevel
    ? Math.max(1, 2 * effectiveZoomLevel)
    : 2

  return {
    position,
    lookAt: { x: cx, y: 0, z: cz },
    focalLength,
  }
}
