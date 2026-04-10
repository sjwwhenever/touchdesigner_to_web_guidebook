// Fullscreen pass: we draw a single PlaneGeometry (2x2) in clip space
// and forward its UVs to the fragment shader.
//
// Three.js already provides `uv` and `position` as attributes when
// you use PlaneGeometry, so this is a trivial pass-through.

varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
