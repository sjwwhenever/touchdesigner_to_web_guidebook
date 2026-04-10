/**
 * Three.js scene driven by four Svelte stores.
 *
 * TD equivalent of what's inside:
 *   Geometry COMP
 *     Torus SOP   (Three.js: TorusKnotGeometry)
 *     Transform   (mesh.rotation.y, updated per frame)
 *     GLSL TOP    (ShaderMaterial with hue/glow uniforms)
 *   Render TOP → Out TOP
 */

import * as THREE from 'three';
import { get } from 'svelte/store';
import { rotSpeed, complexity, hue, glow } from './stores.js';

const vertexShader = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vPos;
  void main() {
    vNormal = normalMatrix * normal;
    vPos = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  precision highp float;
  varying vec3 vNormal;
  varying vec3 vPos;

  uniform float uHue;
  uniform float uGlow;
  uniform float uTime;

  // HSV → RGB, standard cheap version
  vec3 hsv2rgb(vec3 c) {
    vec4 K = vec4(1.0, 2.0/3.0, 1.0/3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
  }

  void main() {
    vec3 n = normalize(vNormal);
    float rim = 1.0 - max(dot(n, vec3(0.0, 0.0, 1.0)), 0.0);
    rim = pow(rim, 2.0);

    vec3 base = hsv2rgb(vec3(uHue, 0.9, 0.9));
    vec3 rimCol = hsv2rgb(vec3(fract(uHue + 0.5), 0.7, 1.0));
    vec3 col = mix(base * 0.4, rimCol, rim);

    // Glow amount just brightens everything and pushes rim harder.
    col += rimCol * uGlow * rim * 2.0;

    gl_FragColor = vec4(col, 1.0);
  }
`;

export class Scene {
  private renderer: THREE.WebGLRenderer;
  private scene = new THREE.Scene();
  private camera: THREE.PerspectiveCamera;
  private mesh!: THREE.Mesh;
  private material: THREE.ShaderMaterial;
  private clock = new THREE.Clock();
  private raf = 0;
  private currentComplexity = -1;

  constructor(canvas: HTMLCanvasElement) {
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setClearColor(0x0a0a0f);

    this.camera = new THREE.PerspectiveCamera(60, 1, 0.1, 100);
    this.camera.position.set(0, 0, 4);

    this.material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uHue:  { value: 0.5 },
        uGlow: { value: 0.5 },
        uTime: { value: 0 },
      },
    });

    this.rebuildGeometry();
    this.resize();
  }

  /** Called when "complexity" changes enough to warrant rebuilding the geo. */
  private rebuildGeometry() {
    const c = get(complexity);
    // Quantize so we don't rebuild on every tiny CC flicker.
    const q = Math.round(c * 7); // 0..7 discrete steps
    if (q === this.currentComplexity) return;
    this.currentComplexity = q;

    if (this.mesh) {
      this.scene.remove(this.mesh);
      this.mesh.geometry.dispose();
    }

    // p and q control how the knot winds (Torus Knot SOP equivalents).
    const geom = new THREE.TorusKnotGeometry(1, 0.35, 200, 32, q + 1, q + 2);
    this.mesh = new THREE.Mesh(geom, this.material);
    this.scene.add(this.mesh);
  }

  resize() {
    const w = this.renderer.domElement.clientWidth || window.innerWidth;
    const h = this.renderer.domElement.clientHeight || window.innerHeight;
    this.renderer.setSize(w, h, false);
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
  }

  start() {
    const loop = () => {
      this.raf = requestAnimationFrame(loop);

      const dt = this.clock.getDelta();
      const t = this.clock.elapsedTime;

      // Read stores every frame. This is cheap — `get()` just reads the value.
      // (We could also `subscribe()` once and cache; either is fine here.)
      const speed = (get(rotSpeed) - 0.5) * 4; // -2..2 rad/s
      this.mesh.rotation.y += speed * dt;
      this.mesh.rotation.x += speed * dt * 0.3;

      this.material.uniforms.uHue.value = get(hue);
      this.material.uniforms.uGlow.value = get(glow);
      this.material.uniforms.uTime.value = t;

      this.rebuildGeometry();

      this.renderer.render(this.scene, this.camera);
    };
    loop();
  }

  stop() {
    cancelAnimationFrame(this.raf);
  }
}
