'use client';
import { useEffect, useRef } from 'react';

interface Star  { x:number; y:number; r:number; a:number; da:number }
interface Ember { x:number; y:number; vx:number; vy:number; life:number; maxLife:number; size:number; hot:boolean }
interface MountainLayer { pts:{x:number;y:number}[]; color:string }

function makeRng(seed: number) {
  let s = seed >>> 0;
  return (lo = 0, hi = 1) => {
    s ^= s << 13; s ^= s >> 17; s ^= s << 5;
    return lo + ((s >>> 0) / 0xffffffff) * (hi - lo);
  };
}

export default function BattlefieldCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    const rng  = makeRng(0xDEAD_BEEF);

    let W = 0, H = 0;
    let stars: Star[] = [];
    let embers: Ember[] = [];
    let mountains: MountainLayer[] = [];
    let rafId = 0;
    let last = performance.now();
    let emberTimer = 0;

    function build() {
      W = canvas!.width  = window.innerWidth;
      H = canvas!.height = window.innerHeight;

      stars = Array.from({ length: 220 }, () => ({
        x: rng(0, W), y: rng(0, H * 0.8),
        r: rng(0.3, 1.6), a: rng(0.2, 0.95), da: (rng() - 0.5) * 0.007,
      }));

      mountains = ([0.55, 0.68, 0.78] as const).map((base, li) => {
        const r2 = makeRng(0xabcd + li * 7);
        const pts: {x:number;y:number}[] = [{ x: 0, y: H }];
        const steps = 22 + li * 8;
        for (let i = 0; i <= steps; i++) {
          const t = i / steps;
          const y = H * base - H * 0.16 * Math.abs(Math.sin(i * 1.4 + li * 0.9)) + r2(-0.02, 0.02) * H;
          pts.push({ x: t * W, y });
        }
        pts.push({ x: W, y: H });
        const alpha = 0.13 + li * 0.11;
        const colors = [
          `rgba(12,10,28,${alpha})`,
          `rgba(8,12,22,${alpha + 0.06})`,
          `rgba(5,8,16,${alpha + 0.12})`,
        ];
        return { pts, color: colors[li] };
      });
    }

    function spawnEmber() {
      embers.push({
        x: rng(W * 0.1, W * 0.9), y: H * 0.93,
        vx: rng(-10, 10), vy: rng(-35, -80),
        life: 1, maxLife: rng(1.8, 4.5),
        size: rng(1, 3), hot: rng() > 0.55,
      });
    }

    function tick(now: number) {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;

      ctx.clearRect(0, 0, W, H);

      // Sky
      const sky = ctx.createLinearGradient(0, 0, 0, H);
      sky.addColorStop(0, '#010108');
      sky.addColorStop(0.5, '#060610');
      sky.addColorStop(1, '#0e0610');
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, W, H);

      // Horizon glow
      const hg = ctx.createRadialGradient(W / 2, H * 0.78, 0, W / 2, H * 0.78, W * 0.45);
      hg.addColorStop(0, 'rgba(255,70,0,0.055)');
      hg.addColorStop(1, 'transparent');
      ctx.fillStyle = hg;
      ctx.fillRect(0, 0, W, H);

      // Stars
      for (const s of stars) {
        s.a += s.da;
        if (s.a > 0.95 || s.a < 0.08) s.da *= -1;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(200,210,255,${s.a})`;
        ctx.fill();
      }

      // Mountains
      for (const m of mountains) {
        ctx.beginPath();
        for (let i = 0; i < m.pts.length; i++) {
          const p = m.pts[i];
          i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y);
        }
        ctx.closePath();
        ctx.fillStyle = m.color;
        ctx.fill();
      }

      // Embers
      emberTimer -= dt;
      if (emberTimer <= 0) { spawnEmber(); emberTimer = rng(0.07, 0.22); }

      for (let i = embers.length - 1; i >= 0; i--) {
        const e = embers[i];
        e.x += e.vx * dt; e.y += e.vy * dt;
        e.vy += 12 * dt;
        e.vx += (rng() - 0.5) * 8 * dt;
        e.life -= dt / e.maxLife;
        if (e.life <= 0) { embers.splice(i, 1); continue; }
        const a = e.life * 0.65;
        if (e.hot) {
          ctx.globalCompositeOperation = 'screen';
          ctx.fillStyle = `rgba(255,${100 + (e.life * 100) | 0},20,${a})`;
        } else {
          ctx.globalCompositeOperation = 'source-over';
          ctx.fillStyle = `rgba(255,${50 + (e.life * 60) | 0},0,${a * 0.5})`;
        }
        ctx.beginPath();
        ctx.arc(e.x, e.y, e.size * e.life, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalCompositeOperation = 'source-over';
      }

      rafId = requestAnimationFrame(tick);
    }

    build();
    window.addEventListener('resize', build);
    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', build);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      className="absolute inset-0 w-full h-full"
      style={{ zIndex: 0 }}
    />
  );
}
