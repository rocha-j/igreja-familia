import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  Mesh,
  OrthographicCamera,
  PlaneGeometry,
  Points,
  Scene,
  ShaderMaterial,
  TextureLoader,
  Vector2,
  WebGLRenderer,
} from 'three';
import { useEffect, useRef, useState } from 'react';
import './HeroScene.css';

gsap.registerPlugin(ScrollTrigger);

interface HeroSceneProps {
  /** Photo to draw as the scene's backdrop. */
  src: string;
  /** Vertical anchor of the photo crop, 0 = top edge, 1 = bottom edge. */
  focusY?: number;
}

const PLANE_VERTEX = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

// The photo, cropped like CSS "cover", with a slow heat-haze ripple, a warm
// grade, a vignette and a scroll-driven zoom that darkens it as you leave.
const PLANE_FRAGMENT = /* glsl */ `
  uniform sampler2D uTex;
  uniform float uTime;
  uniform float uScroll;
  uniform vec2 uMouse;
  uniform vec2 uRes;
  uniform vec2 uImg;
  uniform vec2 uFocus;
  varying vec2 vUv;
  void main() {
    float ra = uRes.x / uRes.y;
    float ia = uImg.x / uImg.y;
    vec2 s = ra > ia ? vec2(1.0, ia / ra) : vec2(ra / ia, 1.0);
    vec2 uv = vUv * s + (1.0 - s) * uFocus;
    uv = (uv - uFocus) * (1.0 - 0.14 * uScroll) + uFocus;
    uv += uMouse * 0.012;
    float k = 0.6 + 1.2 * uScroll;
    float w = sin(uv.y * 22.0 + uTime * 0.9) * 0.0016 + sin(uv.x * 13.0 + uTime * 0.6) * 0.0012;
    uv += vec2(w, w * 0.6) * k;
    vec3 c = texture2D(uTex, clamp(uv, 0.001, 0.999)).rgb;
    c *= mix(vec3(1.0), vec3(1.06, 1.0, 0.88), 0.7);
    float d = distance(vUv, vec2(0.5));
    c *= 1.0 - smoothstep(0.35, 0.95, d) * 0.4;
    c *= 1.0 - 0.5 * uScroll;
    gl_FragColor = vec4(c, 1.0);
  }
`;

const PARTICLE_VERTEX = /* glsl */ `
  attribute vec2 aSeed;
  uniform float uTime;
  uniform float uScroll;
  uniform float uPx;
  varying float vA;
  void main() {
    vec3 p = position;
    p.y = mod(p.y + 1.0 + uTime * 0.035 * aSeed.x + uScroll * 0.5 * aSeed.x, 2.0) - 1.0;
    p.x += sin(uTime * 0.4 + aSeed.y) * 0.04;
    vA = smoothstep(-1.0, -0.6, p.y) * (1.0 - smoothstep(0.5, 1.0, p.y)) * (0.35 + 0.65 * aSeed.x);
    gl_Position = vec4(p.xy, 0.0, 1.0);
    gl_PointSize = (2.0 + aSeed.x * 6.0) * uPx;
  }
`;

const PARTICLE_FRAGMENT = /* glsl */ `
  varying float vA;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    float a = smoothstep(0.5, 0.0, d) * vA;
    gl_FragColor = vec4(1.0, 0.72, 0.36, a);
  }
`;

/**
 * The Hero photo as a WebGL plane with drifting amber light motes. It draws
 * only while the Hero is on screen and the tab is visible, caps the pixel
 * ratio, and fades in over the static photo once the texture has loaded.
 */
export default function HeroScene({ src, focusY = 0.15 }: HeroSceneProps) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const el = canvas.current;
    const host = el?.parentElement;
    if (!el || !host) return;

    const renderer = new WebGLRenderer({ canvas: el, antialias: false, alpha: false, powerPreference: 'high-performance' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    const scene = new Scene();
    const camera = new OrthographicCamera(-1, 1, 1, -1, 0, 1);

    const plane = new ShaderMaterial({
      uniforms: {
        uTex: { value: null },
        uTime: { value: 0 },
        uScroll: { value: 0 },
        uMouse: { value: new Vector2() },
        uRes: { value: new Vector2(1, 1) },
        uImg: { value: new Vector2(1, 1) },
        uFocus: { value: new Vector2(0.5, 1 - focusY) },
      },
      vertexShader: PLANE_VERTEX,
      fragmentShader: PLANE_FRAGMENT,
      depthTest: false,
      depthWrite: false,
    });
    const planeGeometry = new PlaneGeometry(2, 2);
    scene.add(new Mesh(planeGeometry, plane));

    const COUNT = 150;
    const positions = new Float32Array(COUNT * 3);
    const seeds = new Float32Array(COUNT * 2);
    for (let i = 0; i < COUNT; i++) {
      positions[i * 3] = Math.random() * 2 - 1;
      positions[i * 3 + 1] = Math.random() * 2 - 1;
      seeds[i * 2] = 0.2 + Math.random() * 0.8;
      seeds[i * 2 + 1] = Math.random() * Math.PI * 2;
    }
    const particleGeometry = new BufferGeometry();
    particleGeometry.setAttribute('position', new BufferAttribute(positions, 3));
    particleGeometry.setAttribute('aSeed', new BufferAttribute(seeds, 2));
    const particles = new ShaderMaterial({
      uniforms: { uTime: { value: 0 }, uScroll: { value: 0 }, uPx: { value: renderer.getPixelRatio() } },
      vertexShader: PARTICLE_VERTEX,
      fragmentShader: PARTICLE_FRAGMENT,
      transparent: true,
      depthTest: false,
      depthWrite: false,
      blending: AdditiveBlending,
    });
    const points = new Points(particleGeometry, particles);
    points.frustumCulled = false;
    scene.add(points);

    let alive = true;
    let loaded = false;
    let visible = true;
    let scrollProgress = 0;
    const mouse = { x: 0, y: 0, tx: 0, ty: 0 };

    const texture = new TextureLoader().load(
      src,
      (tex) => {
        if (!alive) return;
        const image = tex.image as { width: number; height: number };
        plane.uniforms.uImg.value.set(image.width, image.height);
        loaded = true;
        setReady(true);
      },
      undefined,
      () => {
        // The static photo underneath stays; there is nothing to fade in.
      },
    );
    plane.uniforms.uTex.value = texture;

    const resize = () => {
      const { width, height } = host.getBoundingClientRect();
      renderer.setSize(width, height, false);
      plane.uniforms.uRes.value.set(width, height);
    };
    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(host);

    const onPointer = (event: PointerEvent) => {
      const r = host.getBoundingClientRect();
      mouse.tx = ((event.clientX - r.left) / r.width - 0.5) * 2;
      mouse.ty = -((event.clientY - r.top) / r.height - 0.5) * 2;
    };
    host.addEventListener('pointermove', onPointer);

    const trigger = ScrollTrigger.create({
      trigger: host,
      start: 'top top',
      end: 'bottom top',
      onUpdate: (self) => {
        scrollProgress = self.progress;
      },
      onToggle: (self) => {
        visible = self.isActive;
      },
    });

    const frame = (time: number) => {
      if (!alive || !loaded || !visible || document.hidden) return;
      mouse.x += (mouse.tx - mouse.x) * 0.05;
      mouse.y += (mouse.ty - mouse.y) * 0.05;
      plane.uniforms.uTime.value = time;
      plane.uniforms.uScroll.value = scrollProgress;
      plane.uniforms.uMouse.value.set(mouse.x, mouse.y);
      particles.uniforms.uTime.value = time;
      particles.uniforms.uScroll.value = scrollProgress;
      renderer.render(scene, camera);
    };
    gsap.ticker.add(frame);

    return () => {
      alive = false;
      gsap.ticker.remove(frame);
      trigger.kill();
      observer.disconnect();
      host.removeEventListener('pointermove', onPointer);
      texture.dispose();
      plane.dispose();
      particles.dispose();
      planeGeometry.dispose();
      particleGeometry.dispose();
      renderer.dispose();
    };
  }, [src, focusY]);

  return <canvas ref={canvas} className={`hero-scene ${ready ? 'is-ready' : ''}`} aria-hidden="true" />;
}
