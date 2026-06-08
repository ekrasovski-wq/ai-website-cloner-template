"use client";
// Source: reactbits.dev / FlyingPosters
// Adapted to TypeScript. Real WebGL vertex-shader rotation per vertex creates
// genuine 3D bending of the poster cards as they scroll past.

import { useRef, useEffect } from "react";
import { Renderer, Camera, Transform, Plane, Program, Mesh, Texture } from "ogl";

const vertexShader = `
precision highp float;

attribute vec3 position;
attribute vec2 uv;
attribute vec3 normal;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform mat3 normalMatrix;

uniform float uPosition;
uniform float uTime;
uniform float uSpeed;
uniform vec3 distortionAxis;
uniform vec3 rotationAxis;
uniform float uDistortion;

varying vec2 vUv;
varying vec3 vNormal;

float PI = 3.141592653589793238;
mat4 rotationMatrix(vec3 axis, float angle) {
    axis = normalize(axis);
    float s = sin(angle);
    float c = cos(angle);
    float oc = 1.0 - c;

    return mat4(
      oc * axis.x * axis.x + c,         oc * axis.x * axis.y - axis.z * s,  oc * axis.z * axis.x + axis.y * s,  0.0,
      oc * axis.x * axis.y + axis.z * s,oc * axis.y * axis.y + c,           oc * axis.y * axis.z - axis.x * s,  0.0,
      oc * axis.z * axis.x - axis.y * s,oc * axis.y * axis.z + axis.x * s,  oc * axis.z * axis.z + c,           0.0,
      0.0,                              0.0,                                0.0,                                1.0
    );
}

vec3 rotate(vec3 v, vec3 axis, float angle) {
  mat4 m = rotationMatrix(axis, angle);
  return (m * vec4(v, 1.0)).xyz;
}

float qinticInOut(float t) {
  return t < 0.5
    ? 16.0 * pow(t, 5.0)
    : -0.5 * abs(pow(2.0 * t - 2.0, 5.0)) + 1.0;
}

void main() {
  vUv = uv;

  float norm = 0.5;
  vec3 newpos = position;
  float offset = (dot(distortionAxis, position) + norm / 2.) / norm;
  float localprogress = clamp(
    (fract(uPosition * 5.0 * 0.01) - 0.01 * uDistortion * offset) / (1. - 0.01 * uDistortion),
    0.,
    2.
  );
  localprogress = qinticInOut(localprogress) * PI;
  newpos = rotate(newpos, rotationAxis, localprogress);

  gl_Position = projectionMatrix * modelViewMatrix * vec4(newpos, 1.0);
}
`;

const fragmentShader = `
precision highp float;

uniform vec2 uImageSize;
uniform vec2 uPlaneSize;
uniform sampler2D tMap;

varying vec2 vUv;

void main() {
  vec2 imageSize = uImageSize;
  vec2 planeSize = uPlaneSize;

  float imageAspect = imageSize.x / imageSize.y;
  float planeAspect = planeSize.x / planeSize.y;
  vec2 scale = vec2(1.0, 1.0);

  if (planeAspect > imageAspect) {
      scale.x = imageAspect / planeAspect;
  } else {
      scale.y = planeAspect / imageAspect;
  }

  vec2 uv = vUv * scale + (1.0 - scale) * 0.5;

  gl_FragColor = texture2D(tMap, uv);
}
`;

function lerp(p1: number, p2: number, t: number) {
  return p1 + (p2 - p1) * t;
}

function map(num: number, min1: number, max1: number, min2: number, max2: number) {
  const num1 = (num - min1) / (max1 - min1);
  return num1 * (max2 - min2) + min2;
}

interface CanvasOpts {
  container: HTMLElement;
  canvas: HTMLCanvasElement;
  items: string[];
  planeWidth: number;
  planeHeight: number;
  distortion: number;
  scrollEase: number;
  cameraFov: number;
  cameraZ: number;
}

interface MediaOpts {
  gl: WebGLRenderingContext;
  geometry: Plane;
  scene: Transform;
  screen: { width: number; height: number };
  viewport: { width: number; height: number };
  image: string;
  length: number;
  index: number;
  planeWidth: number;
  planeHeight: number;
  distortion: number;
}

/* eslint-disable @typescript-eslint/no-explicit-any */
class Media {
  extra = 0;
  gl: any;
  geometry: any;
  scene: any;
  screen: { width: number; height: number };
  viewport: { width: number; height: number };
  image: string;
  length: number;
  index: number;
  planeWidth: number;
  planeHeight: number;
  distortion: number;
  program: any;
  plane: any;
  padding = 5;
  height = 0;
  heightTotal = 0;
  y = 0;

  constructor(o: MediaOpts) {
    this.gl = o.gl;
    this.geometry = o.geometry;
    this.scene = o.scene;
    this.screen = o.screen;
    this.viewport = o.viewport;
    this.image = o.image;
    this.length = o.length;
    this.index = o.index;
    this.planeWidth = o.planeWidth;
    this.planeHeight = o.planeHeight;
    this.distortion = o.distortion;
    this.createShader();
    this.createMesh();
    this.onResize();
  }

  createShader() {
    const texture = new Texture(this.gl, { generateMipmaps: false });
    this.program = new Program(this.gl, {
      depthTest: false,
      depthWrite: false,
      fragment: fragmentShader,
      vertex: vertexShader,
      uniforms: {
        tMap: { value: texture },
        uPosition: { value: 0 },
        uPlaneSize: { value: [0, 0] },
        uImageSize: { value: [0, 0] },
        uSpeed: { value: 0 },
        rotationAxis: { value: [0, 1, 0] },
        distortionAxis: { value: [1, 1, 0] },
        uDistortion: { value: this.distortion },
        uViewportSize: { value: [this.viewport.width, this.viewport.height] },
        uTime: { value: 0 },
      },
      cullFace: false,
    });
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = this.image;
    img.onload = () => {
      texture.image = img;
      this.program.uniforms.uImageSize.value = [img.naturalWidth, img.naturalHeight];
    };
  }

  createMesh() {
    this.plane = new Mesh(this.gl, { geometry: this.geometry, program: this.program });
    this.plane.setParent(this.scene);
  }

  setScale() {
    this.plane.scale.x = (this.viewport.width * this.planeWidth) / this.screen.width;
    this.plane.scale.y = (this.viewport.height * this.planeHeight) / this.screen.height;
    this.plane.position.x = 0;
    this.plane.program.uniforms.uPlaneSize.value = [this.plane.scale.x, this.plane.scale.y];
  }

  onResize(o?: { screen?: { width: number; height: number }; viewport?: { width: number; height: number } }) {
    if (o?.screen) this.screen = o.screen;
    if (o?.viewport) {
      this.viewport = o.viewport;
      this.plane.program.uniforms.uViewportSize.value = [this.viewport.width, this.viewport.height];
    }
    this.setScale();
    this.padding = 5;
    this.height = this.plane.scale.y + this.padding;
    this.heightTotal = this.height * this.length;
    this.y = -this.heightTotal / 2 + (this.index + 0.5) * this.height;
  }

  update(scroll: { current: number }) {
    this.plane.position.y = this.y - scroll.current - this.extra;
    const pos = map(this.plane.position.y, -this.viewport.height, this.viewport.height, 5, 15);
    this.program.uniforms.uPosition.value = pos;
    this.program.uniforms.uTime.value += 0.04;
    this.program.uniforms.uSpeed.value = scroll.current;

    const ph = this.plane.scale.y;
    const vh = this.viewport.height;
    const topEdge = this.plane.position.y + ph / 2;
    const bottomEdge = this.plane.position.y - ph / 2;
    if (topEdge < -vh / 2) this.extra -= this.heightTotal;
    else if (bottomEdge > vh / 2) this.extra += this.heightTotal;
  }
}

class FPCanvas {
  container: HTMLElement;
  canvas: HTMLCanvasElement;
  items: string[];
  planeWidth: number;
  planeHeight: number;
  distortion: number;
  scroll = { ease: 0.01, current: 0, target: 0, last: 0, position: 0 };
  cameraFov: number;
  cameraZ: number;
  renderer!: any;
  gl!: any;
  camera!: any;
  scene!: any;
  planeGeometry!: any;
  medias: Media[] = [];
  isDown = false;
  start = 0;
  screen!: { width: number; height: number };
  viewport!: { width: number; height: number };
  rafId = 0;
  loaded = 0;
  destroyed = false;
  autoSpeed = 0.15; // continuous auto-scroll

  constructor(o: CanvasOpts) {
    this.container = o.container;
    this.canvas = o.canvas;
    this.items = o.items;
    this.planeWidth = o.planeWidth;
    this.planeHeight = o.planeHeight;
    this.distortion = o.distortion;
    this.scroll.ease = o.scrollEase;
    this.cameraFov = o.cameraFov;
    this.cameraZ = o.cameraZ;

    this.onResize = this.onResize.bind(this);
    this.onTouchDown = this.onTouchDown.bind(this);
    this.onTouchMove = this.onTouchMove.bind(this);
    this.onTouchUp = this.onTouchUp.bind(this);
    this.onWheel = this.onWheel.bind(this);
    this.update = this.update.bind(this);

    this.createRenderer();
    this.createCamera();
    this.createScene();
    this.onResize();
    this.createGeometry();
    this.createMedias();
    this.update();
    this.addEventListeners();
  }

  createRenderer() {
    this.renderer = new Renderer({
      canvas: this.canvas,
      alpha: true,
      antialias: true,
      dpr: Math.min(window.devicePixelRatio, 2),
    });
    this.gl = this.renderer.gl;
  }
  createCamera() {
    this.camera = new Camera(this.gl);
    this.camera.fov = this.cameraFov;
    this.camera.position.z = this.cameraZ;
  }
  createScene() {
    this.scene = new Transform();
  }
  createGeometry() {
    this.planeGeometry = new Plane(this.gl, { heightSegments: 1, widthSegments: 100 });
  }
  createMedias() {
    this.medias = this.items.map(
      (image, index) =>
        new Media({
          gl: this.gl,
          geometry: this.planeGeometry,
          scene: this.scene,
          screen: this.screen,
          viewport: this.viewport,
          image,
          length: this.items.length,
          index,
          planeWidth: this.planeWidth,
          planeHeight: this.planeHeight,
          distortion: this.distortion,
        })
    );
  }
  onResize() {
    const rect = this.container.getBoundingClientRect();
    this.screen = { width: rect.width, height: rect.height };
    this.renderer.setSize(this.screen.width, this.screen.height);
    this.camera.perspective({ aspect: this.gl.canvas.width / this.gl.canvas.height });
    const fov = (this.camera.fov * Math.PI) / 180;
    const height = 2 * Math.tan(fov / 2) * this.camera.position.z;
    const width = height * this.camera.aspect;
    this.viewport = { height, width };
    if (this.medias) this.medias.forEach((m) => m.onResize({ screen: this.screen, viewport: this.viewport }));
  }
  onTouchDown(e: MouseEvent | TouchEvent) {
    this.isDown = true;
    this.scroll.position = this.scroll.current;
    this.start = "touches" in e && e.touches[0] ? e.touches[0].clientY : (e as MouseEvent).clientY;
  }
  onTouchMove(e: MouseEvent | TouchEvent) {
    if (!this.isDown) return;
    const y = "touches" in e && e.touches[0] ? e.touches[0].clientY : (e as MouseEvent).clientY;
    const distance = (this.start - y) * 0.1;
    this.scroll.target = this.scroll.position + distance;
  }
  onTouchUp() {
    this.isDown = false;
  }
  onWheel(e: WheelEvent) {
    this.scroll.target += e.deltaY * 0.005;
  }
  update() {
    if (this.destroyed) return;
    // Continuous auto-scroll so cards never stop moving even without input
    this.scroll.target += this.autoSpeed * 0.016;
    this.scroll.current = lerp(this.scroll.current, this.scroll.target, this.scroll.ease);
    if (this.medias) this.medias.forEach((m) => m.update(this.scroll));
    this.renderer.render({ scene: this.scene, camera: this.camera });
    this.scroll.last = this.scroll.current;
    this.rafId = requestAnimationFrame(this.update);
  }
  addEventListeners() {
    window.addEventListener("resize", this.onResize);
    this.canvas.addEventListener("wheel", this.onWheel as any, { passive: false });
    this.canvas.addEventListener("mousedown", this.onTouchDown as any);
    window.addEventListener("mousemove", this.onTouchMove as any);
    window.addEventListener("mouseup", this.onTouchUp);
    this.canvas.addEventListener("touchstart", this.onTouchDown as any);
    window.addEventListener("touchmove", this.onTouchMove as any, { passive: false });
    window.addEventListener("touchend", this.onTouchUp);
  }
  destroy() {
    this.destroyed = true;
    cancelAnimationFrame(this.rafId);
    window.removeEventListener("resize", this.onResize);
    this.canvas.removeEventListener("wheel", this.onWheel as any);
    this.canvas.removeEventListener("mousedown", this.onTouchDown as any);
    window.removeEventListener("mousemove", this.onTouchMove as any);
    window.removeEventListener("mouseup", this.onTouchUp);
    this.canvas.removeEventListener("touchstart", this.onTouchDown as any);
    window.removeEventListener("touchmove", this.onTouchMove as any);
    window.removeEventListener("touchend", this.onTouchUp);
  }
}

interface Props {
  items: string[];
  planeWidth?: number;
  planeHeight?: number;
  distortion?: number;
  scrollEase?: number;
  cameraFov?: number;
  cameraZ?: number;
}

export default function FlyingPosters({
  items,
  planeWidth = 320,
  planeHeight = 320,
  distortion = 3,
  scrollEase = 0.01,
  cameraFov = 45,
  cameraZ = 20,
}: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!containerRef.current || !canvasRef.current || !items.length) return;
    const instance = new FPCanvas({
      container: containerRef.current,
      canvas: canvasRef.current,
      items,
      planeWidth,
      planeHeight,
      distortion,
      scrollEase,
      cameraFov,
      cameraZ,
    });
    return () => instance.destroy();
  }, [items, planeWidth, planeHeight, distortion, scrollEase, cameraFov, cameraZ]);

  return (
    <div
      ref={containerRef}
      style={{ width: "100%", height: "100%", overflow: "hidden", position: "relative" }}
    >
      <canvas ref={canvasRef} style={{ display: "block", width: "100%", height: "100%" }} />
    </div>
  );
}
