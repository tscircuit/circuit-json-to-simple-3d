import type { AnglePreset } from "./getDefaultCameraForPcbBoard"

export interface BackgroundOptions {
  color?: string
  opacity?: number
}

export interface Simple3dSvgOptions {
  camera?: {
    position: { x: number; y: number; z: number }
    lookAt: { x: number; y: number; z: number }
    focalLength?: number
  }
  anglePreset?: AnglePreset
  defaultZoomMultiplier?: number
  background?: BackgroundOptions
  width?: number
  height?: number
}

export interface RenderSceneOptions {
  backgroundColor?: string
  width?: number
  height?: number
  viewBox?: string
}
