// Feedback TOP equivalent:
//   read last frame from uPrev, transform its UVs (rotate + zoom), fade
//   its color, then additively blend in a soft dot at uMouse.
//
// TD side:
//   Feedback TOP -> Transform TOP (rotate, scale) -> Level TOP (multiply)
//                -> Over TOP (add brush) -> Out TOP
//
// The GLSL below would be nearly identical inside a TD GLSL TOP;
// only the uniform declarations and the `vUv` varying differ.

precision highp float;

uniform sampler2D uPrev;   // last frame (ping-pong render target)
uniform vec2  uResolution;
uniform vec2  uMouse;      // normalized 0..1
uniform float uTime;
uniform float uRotation;   // rad/s, drives Transform TOP
uniform float uZoom;       // per-frame zoom factor, ~1.01 for outward spiral
uniform float uFade;       // 0..1, multiplier on previous frame

varying vec2 vUv;

vec2 rotate(vec2 p, float a) {
  float c = cos(a), s = sin(a);
  return mat2(c, -s, s, c) * p;
}

void main() {
  // 1. Transform UVs: rotate & zoom around the center.
  vec2 centered = vUv - 0.5;
  centered = rotate(centered, uRotation);
  centered /= uZoom;
  vec2 uv = centered + 0.5;

  // 2. Sample previous frame and fade it (= Level TOP multiply).
  vec3 prev = texture2D(uPrev, uv).rgb * uFade;

  // 3. Inject a soft dot at the mouse position, color cycling with time.
  float d    = distance(vUv, uMouse);
  float brush = exp(-d * d * 400.0); // gaussian, tight spot
  vec3  hue  = 0.5 + 0.5 * cos(uTime * 0.8 + vec3(0.0, 2.094, 4.188));
  vec3  add  = hue * brush * 1.2;

  gl_FragColor = vec4(prev + add, 1.0);
}
