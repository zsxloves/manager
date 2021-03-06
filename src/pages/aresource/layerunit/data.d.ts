export interface billboard {
  image?: string;
  opacity?: number;
  scale?: number;
  rotationDegree?: number;
  horizontalOrigin?: any;
  verticalOrigin?: any;
  width?: number;
  height?: number;
  hasPixelOffset?: boolean;
  pixelOffsetX?: number;
  pixelOffsetY?: number;
  pixelOffset?: any;
  scaleByDistance?: any;
  scaleByDistance_far?: number;
  scaleByDistance_farValue?: number;
  scaleByDistance_near?: number;
  scaleByDistance_nearValue?: number;
  distanceDisplayCondition?: any;
  distanceDisplayCondition_far?: number;
  distanceDisplayCondition_near?: number;
  clampToGround?: boolean;
  heightReference?: any;
  visibleDepth?: boolean;
  disableDepthTestDistance?: number;
  color?: any;
  eyeOffset?: any;
  alignedAxis?: any;
  sizeInMeters?: boolean;
  translucencyByDistance?: any;
  pixelOffsetScaleByDistance?: any;
  imageSubRegion?: any;
  setHeight?: any;
  addHeight?: any;
  highlight?: any;
  label?: any;
}
export interface polyline {
  distanceDisplayCondition?: any;
  distanceDisplayCondition_far?: number;
  distanceDisplayCondition_near?: number;
  opacity?: number;
  color?: any;
  width?: number;
  speed?: number;
  materialType?:
    | 'LineTrail'
    | 'LineFlicker'
    | 'ODLine'
    | 'LineFlow'
    | 'PolylineArrow'
    | 'PolylineGlow'
    | 'PolylineOutline'
    | 'PolylineDash'
    | '';
  material?: any;
  randomColor?: boolean;
  depthFailMaterial?: any;
  closure?: boolean;
  outline?: boolean;
  outlineColor?: any;
  outlineWidth?: number;
  depthFail?: boolean;
  depthFailColor?: string;
  depthFailOpacity?: number;
  arcType?: any;
  granularity?: number;
  hasShadows?: boolean;
  shadows?: boolean;
  classificationType?: any;
  zIndex?: number;
  clampToGround?: boolean;
}
export interface polygon {
  color?: any;
  fill?: boolean;
  stRotation?: number;
  stRotationDegree?: number;
  outlineOpacity?: number;
  outlineStyle?: any;
  diffHeight?: number;
  extrudedHeight?: number;
  extrudedHeightReference?: any;
  closeTop?: any;
  closeBottom?: any;
  perPositionHeight?: boolean;
  buffer?: number;
  clampToGround?: boolean;
  opacity?: number;
}
export interface label {
  text?: string;
  scale?: number;
  horizontalOrigin?: any;
  verticalOrigin?: any;
  font_family?: string;
  font_size?: number;
  font_weight?: string;
  font_style?: string;
  font?: string;
  fill?: boolean;
  color?: string;
  opacity?: number;
  outline?: boolean;
  outlineColor?: any;
  outlineOpacity?: number;
  outlineWidth?: number;
  background?: boolean;
  backgroundColor?: any;
  backgroundOpacity?: number;
  backgroundPadding?: any;
  hasPixelOffset?: boolean;
  pixelOffsetX?: number;
  pixelOffsetY?: number;
  pixelOffset?: any;
  pixelOffsetScaleByDistance?: any;
  eyeOffset?: any;
  scaleByDistance?: any;
  scaleByDistance_far?: number;
  backgroundOpacity?: number;
  scaleByDistance_farValue?: number;
  scaleByDistance_near?: number;
  scaleByDistance_nearValue?: number;
  distanceDisplayCondition?: any;
  distanceDisplayCondition_far?: number;
  distanceDisplayCondition_near?: number;
  clampToGround?: boolean;
  heightReference?: any;
  visibleDepth?: boolean;
  disableDepthTestDistance?: number;
  translucencyByDistance?: any;
  setHeight?: any;
  addHeight?: any;
}
export interface textstyle {
  text?: string;
  scale?: number;
  horizontalOrigin?: any;
  verticalOrigin?: any;
  font_family?: string;
  font_size?: number;
  font_weight?: string;
  font_style?: string;
  font?: string;
  fill?: boolean;
  color?: string;
  opacity?: number;
  outline?: boolean;
  outlineColor?: any;
  outlineOpacity?: number;
  outlineWidth?: number;
  background?: boolean;
  backgroundColor?: any;
  backgroundOpacity?: number;
  backgroundPadding?: any;
  hasPixelOffset?: boolean;
  pixelOffsetX?: number;
  pixelOffsetY?: number;
  pixelOffset?: any;
  pixelOffsetScaleByDistance?: any;
  eyeOffset?: any;
  scaleByDistance?: any;
  scaleByDistance_far?: number;
  backgroundOpacity?: number;
  scaleByDistance_farValue?: number;
  scaleByDistance_near?: number;
  scaleByDistance_nearValue?: number;
  distanceDisplayCondition?: any;
  distanceDisplayCondition_far?: number;
  distanceDisplayCondition_near?: number;
  clampToGround?: boolean;
  heightReference?: any;
  visibleDepth?: boolean;
  disableDepthTestDistance?: number;
  translucencyByDistance?: any;
  setHeight?: any;
  addHeight?: any;
}
export interface StyleOptions {
  polygon?: polygon;
  polyline?: polyline;
  billboard?: billboard;
  label?: label;
  textstyle?: textstyle;
}
