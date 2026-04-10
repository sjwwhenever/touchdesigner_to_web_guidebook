// Tiny pass-through: copies a texture to the screen.
// In TD this is just a Null TOP or an Out TOP.

precision highp float;

uniform sampler2D uMap;
varying vec2 vUv;

void main() {
  gl_FragColor = texture2D(uMap, vUv);
}
