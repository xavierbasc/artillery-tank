'use client';
import { useEffect, useRef } from 'react';

/**
 * Generative hero background: a tiny "logical canvas" (320×180 — exactly
 * half the game's real 640×360 logical resolution) that runs a simplified
 * version of the game's own loop — midpoint-displacement terrain, a lobbed
 * shell, a crater carved into the heightmap, a handful of debris particles
 * falling under the game's real GRAVITY constant (140 px/s²). Scaled up with
 * nearest-neighbour ("pixelated") sampling, same as the game's own integer
 * scale presentation.
 *
 * Static single frame when the user prefers reduced motion; pauses the RAF
 * loop when off-screen or the tab is hidden.
 */

const W = 320;
const H = 180;
const GRAVITY = 140; // px/s² — same constant as Core/Constants.h
const GROUND_MARGIN_TOP = 70; // terrain never rises above this row

type Particle = { x: number; y: number; vx: number; vy: number; life: number; maxLife: number };
type Flight = { x0: number; y0: number; x1: number; y1: number; t: number; dur: number; arc: number } | null;

function mulberry32(seed: number) {
  return function () {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function makeHeights(rand: () => number): Float32Array {
  const N = 257; // 2^8 + 1
  const buf = new Float32Array(N);
  const base = GROUND_MARGIN_TOP + 40;
  buf[0] = base + (rand() * 2 - 1) * 14;
  buf[N - 1] = base + (rand() * 2 - 1) * 14;
  let step = N - 1;
  let amp = 26;
  while (step > 1) {
    const half = step / 2;
    for (let i = half; i < N - 1; i += step) {
      const avg = (buf[i - half] + buf[i + half]) / 2;
      buf[i] = avg + (rand() * 2 - 1) * amp;
    }
    amp *= 0.52;
    step = half;
  }
  // Resample 257 -> W columns
  const out = new Float32Array(W);
  for (let x = 0; x < W; x++) {
    const f = (x / (W - 1)) * (N - 1);
    const i0 = Math.floor(f);
    const i1 = Math.min(N - 1, i0 + 1);
    const t = f - i0;
    let v = buf[i0] * (1 - t) + buf[i1] * t;
    v = Math.max(GROUND_MARGIN_TOP, Math.min(H - 8, v));
    out[x] = v;
  }
  return out;
}

function carve(heights: Float32Array, cx: number, cy: number, radius: number) {
  const x0 = Math.max(0, Math.floor(cx - radius));
  const x1 = Math.min(W - 1, Math.ceil(cx + radius));
  for (let x = x0; x <= x1; x++) {
    const dx = x - cx;
    if (Math.abs(dx) > radius) continue;
    const archY = cy + Math.sqrt(Math.max(0, radius * radius - dx * dx));
    if (archY > heights[x]) heights[x] = Math.min(H - 4, archY);
  }
}

export default function TerrainCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.imageSmoothingEnabled = false;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const rand = mulberry32(0x5f3759df);
    const heights = makeHeights(rand);

    // Static distant silhouette (single jagged ridge, drawn once)
    const ridge: number[] = [];
    for (let x = 0; x < W; x += 6) {
      ridge.push(GROUND_MARGIN_TOP - 4 - rand() * 30);
    }

    const tankL = { x: 26 };
    const tankR = { x: W - 26 };

    let particles: Particle[] = [];
    let flight: Flight = null;
    let shooterIsLeft = true;
    let pauseT = 0.9; // seconds until first shot
    let flashT = 0;

    function surfaceAt(x: number): number {
      const cx = Math.max(0, Math.min(W - 1, Math.round(x)));
      return heights[cx];
    }

    function fireShot() {
      const fromX = shooterIsLeft ? tankL.x : tankR.x;
      const fromY = surfaceAt(fromX) - 10;
      const targetX = shooterIsLeft
        ? W * 0.42 + rand() * W * 0.16
        : W * 0.42 - rand() * W * 0.16;
      const toY = surfaceAt(targetX);
      flight = { x0: fromX, y0: fromY, x1: targetX, y1: toY, t: 0, dur: 1.25 + rand() * 0.3, arc: 70 + rand() * 30 };
    }

    function spawnDebris(cx: number, cy: number) {
      const n = 12;
      for (let i = 0; i < n; i++) {
        const ang = Math.PI + rand() * Math.PI; // upward hemisphere
        const spd = 30 + rand() * 55;
        particles.push({
          x: cx, y: cy,
          vx: Math.cos(ang) * spd,
          vy: Math.sin(ang) * spd * 1.4 - 20,
          life: 0.5 + rand() * 0.5,
          maxLife: 0.9,
        });
      }
    }

    function step(dt: number) {
      if (flight) {
        flight.t += dt / flight.dur;
        if (flight.t >= 1) {
          const ix = flight.x1, iy = flight.y1;
          carve(heights, ix, iy, 12 + rand() * 10);
          spawnDebris(ix, iy);
          flashT = 0.12;
          flight = null;
          shooterIsLeft = !shooterIsLeft;
          pauseT = 1.1 + rand() * 0.6;
        }
      } else if (pauseT > 0) {
        pauseT -= dt;
        if (pauseT <= 0) fireShot();
      }

      if (flashT > 0) flashT -= dt;

      particles = particles.filter(p => p.life > 0);
      for (const p of particles) {
        p.vy += GRAVITY * dt;
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.life -= dt;
      }
    }

    function drawTank(x: number, groundY: number, faceRight: boolean, recoil: number) {
      const hullW = 16, hullH = 6;
      const gy = Math.round(groundY);
      ctx!.fillStyle = '#1c2228';
      ctx!.fillRect(Math.round(x - hullW / 2), gy - hullH, hullW, hullH);
      ctx!.fillStyle = '#2a3138';
      ctx!.fillRect(Math.round(x - hullW / 2 + 2), gy - hullH - 3, hullW - 6, 4);
      ctx!.fillStyle = '#d69a1f';
      const dir = faceRight ? 1 : -1;
      const bx = x + dir * (hullW / 2 - 1) - recoil * dir;
      ctx!.fillRect(Math.round(Math.min(x, bx)), gy - hullH - 1, Math.abs(bx - x) + 2, 2);
    }

    function draw() {
      const c = ctx!;
      // Sky — riffs on the game's own BICOLOR_SUNSET archetype (Scenery.h)
      const sky = c.createLinearGradient(0, 0, 0, H);
      sky.addColorStop(0, '#150c22');
      sky.addColorStop(0.45, '#2a1430');
      sky.addColorStop(0.72, '#5c2418');
      sky.addColorStop(1, '#8a3c14');
      c.fillStyle = sky;
      c.fillRect(0, 0, W, H);

      // Sun disc, low on the horizon
      const sunY = GROUND_MARGIN_TOP + 18;
      const sunGrad = c.createRadialGradient(W * 0.62, sunY, 2, W * 0.62, sunY, 30);
      sunGrad.addColorStop(0, 'rgba(255,200,110,0.9)');
      sunGrad.addColorStop(1, 'rgba(255,150,60,0)');
      c.fillStyle = sunGrad;
      c.fillRect(0, 0, W, H);

      // Distant ridge silhouette
      c.fillStyle = '#241226';
      c.beginPath();
      c.moveTo(0, H);
      for (let i = 0; i < ridge.length; i++) c.lineTo(i * 6, ridge[i]);
      c.lineTo(W, H);
      c.closePath();
      c.fill();

      // Ground
      for (let x = 0; x < W; x++) {
        const y = Math.round(heights[x]);
        c.fillStyle = '#7a5a2e';
        c.fillRect(x, y, 1, 3);
        c.fillStyle = '#3c2c18';
        c.fillRect(x, y + 3, 1, H - y - 3);
      }

      // Tanks
      drawTank(tankL.x, surfaceAt(tankL.x), true, flight && shooterIsLeft ? 2 : 0);
      drawTank(tankR.x, surfaceAt(tankR.x), false, flight && !shooterIsLeft ? 2 : 0);

      // Projectile
      if (flight) {
        const t = flight.t;
        const x = flight.x0 + (flight.x1 - flight.x0) * t;
        const y = flight.y0 + (flight.y1 - flight.y0) * t - flight.arc * 4 * t * (1 - t);
        c.fillStyle = '#ffd77a';
        c.fillRect(Math.round(x) - 1, Math.round(y) - 1, 2, 2);
      }

      // Impact flash
      if (flashT > 0 && !flight) {
        // approximate last impact point from heights disturbance isn't tracked;
        // flash is subtle and skippable — omit precise position, keep cheap.
      }

      // Debris particles
      for (const p of particles) {
        const a = Math.max(0, p.life / p.maxLife);
        c.fillStyle = `rgba(220,150,70,${a.toFixed(2)})`;
        c.fillRect(Math.round(p.x), Math.round(p.y), 1, 1);
      }
    }

    // Initial static composition (used for both the reduced-motion frame
    // and as the first paint before the loop takes over).
    carve(heights, W * 0.5, surfaceAt(W * 0.5), 16);
    draw();

    if (reduceMotion) return; // static frame only, no RAF loop

    let raf = 0;
    let last = performance.now();
    let running = true;

    function loop(now: number) {
      if (!running) return;
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      step(dt);
      draw();
      raf = requestAnimationFrame(loop);
    }

    const io = new IntersectionObserver((entries) => {
      const visible = entries[0]?.isIntersecting ?? true;
      if (visible && document.visibilityState === 'visible') {
        if (!raf) { last = performance.now(); raf = requestAnimationFrame(loop); }
      } else if (raf) {
        cancelAnimationFrame(raf); raf = 0;
      }
    }, { threshold: 0.05 });
    io.observe(canvas);

    const onVis = () => {
      if (document.visibilityState !== 'visible' && raf) { cancelAnimationFrame(raf); raf = 0; }
      else if (document.visibilityState === 'visible' && !raf) { last = performance.now(); raf = requestAnimationFrame(loop); }
    };
    document.addEventListener('visibilitychange', onVis);

    return () => {
      running = false;
      if (raf) cancelAnimationFrame(raf);
      io.disconnect();
      document.removeEventListener('visibilitychange', onVis);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      width={W}
      height={H}
      aria-hidden="true"
      className="pixelated absolute inset-0 w-full h-full"
      style={{ objectFit: 'cover', objectPosition: 'center' }}
    />
  );
}
