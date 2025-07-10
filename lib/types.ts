export interface ZoomOptions {
  defaultZoomMultiplier?: number
  fitToView?: boolean
}

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
  anglePreset?: import("./getDefaultCameraForPcbBoard").AnglePreset
  zoom?: ZoomOptions
  background?: BackgroundOptions
  width?: number
  height?: number
  scalable?: boolean
}

export interface RenderSceneOptions {
  backgroundColor?: string
  width?: number
  height?: number
  viewBox?: string
  scalable?: boolean
}
