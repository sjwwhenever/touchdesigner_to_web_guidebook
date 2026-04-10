/**
 * Demo 2 — Feedback TOP, but on the web.
 *
 * TD side (the node chain we are reproducing):
 *   Feedback TOP → Transform TOP (rotate + zoom) → Level TOP (multiply)
 *                → Composite TOP (add a brush at mouse) → Out TOP
 *
 * Web side:
 *   Two WebGLRenderTargets. Each frame we read from "prev" and write to
 *   "curr"; then we swap them. That's the ping-pong. Finally we copy the
 *   current target to the screen via a trivial pass-through shader.
 *
 * Every comment block below marks which TD node the surrounding lines
 * correspond to.
 */

import * as THREE from 'three';
import feedbackFrag from './feedback.frag.glsl?raw';
import copyFrag from './copy.frag.glsl?raw';
import passVert from './passthrough.vert.glsl?raw';

// ---- Renderer & canvas ----
const renderer = new THREE.WebGLRenderer({ antialias: false });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// ---- Fullscreen pass plumbing ----
// Clip-space quad: PlaneGeometry(2,2) + a pass-through vertex shader.
// Equivalent to TD's "render a TOP" — we never care about 3D transforms.
const quadGeom = new THREE.PlaneGeometry(2, 2);
const camera = new THREE.Camera();

// Pass A: the feedback shader (reads previous frame, writes next).
const feedbackMat = new THREE.ShaderMaterial({
  vertexShader: passVert,
  fragmentShader: feedbackFrag,
  uniforms: {
    uPrev:       { value: null },                  // Feedback TOP input
    uResolution: { value: new THREE.Vector2() },
    uMouse:      { value: new THREE.Vector2(0.5, 0.5) },
    uTime:       { value: 0 },
    uRotation:   { value: 0.0025 },                // Transform TOP rotation
    uZoom:       { value: 1.006 },                 // Transform TOP scale
    uFade:       { value: 0.985 },                 // Level TOP multiply
  },
});
const feedbackScene = new THREE.Scene();
feedbackScene.add(new THREE.Mesh(quadGeom, feedbackMat));

// Pass B: a trivial copy to the screen.
const copyMat = new THREE.ShaderMaterial({
  vertexShader: passVert,
  fragmentShader: copyFrag,
  uniforms: { uMap: { value: null } },
});
const copyScene = new THREE.Scene();
copyScene.add(new THREE.Mesh(quadGeom, copyMat));

// ---- Ping-pong render targets ----
// These two RTs are the Feedback TOP. Alternate reading / writing each frame.
function makeRT(): THREE.WebGLRenderTarget {
  return new THREE.WebGLRenderTarget(1, 1, {
    minFilter: THREE.LinearFilter,
    magFilter: THREE.LinearFilter,
    format: THREE.RGBAFormat,
    type: THREE.HalfFloatType,
    depthBuffer: false,
    stencilBuffer: false,
  });
}

let rtA = makeRT();
let rtB = makeRT();

function resize() {
  const w = window.innerWidth;
  const h = window.innerHeight;
  const dpr = Math.min(window.devicePixelRatio, 2);
  renderer.setSize(w, h);
  rtA.setSize(w * dpr, h * dpr);
  rtB.setSize(w * dpr, h * dpr);
  feedbackMat.uniforms.uResolution.value.set(w * dpr, h * dpr);
}
window.addEventListener('resize', resize);
resize();

// ---- Mouse injection (= TD "Mouse In CHOP → Circle TOP → Composite TOP") ----
window.addEventListener('pointermove', (e) => {
  feedbackMat.uniforms.uMouse.value.set(
    e.clientX / window.innerWidth,
    1 - e.clientY / window.innerHeight, // GL y-up
  );
});

// ---- Render loop ----
const clock = new THREE.Clock();

function frame() {
  feedbackMat.uniforms.uTime.value = clock.getElapsedTime();
  feedbackMat.uniforms.uPrev.value = rtA.texture;

  // Pass A: feedback shader writes next frame into rtB.
  renderer.setRenderTarget(rtB);
  renderer.render(feedbackScene, camera);

  // Pass B: copy rtB to the default framebuffer (the screen).
  copyMat.uniforms.uMap.value = rtB.texture;
  renderer.setRenderTarget(null);
  renderer.render(copyScene, camera);

  // Swap ping-pong targets.
  [rtA, rtB] = [rtB, rtA];

  requestAnimationFrame(frame);
}
frame();
