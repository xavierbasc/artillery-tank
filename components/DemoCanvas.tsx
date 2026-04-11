'use client';
import { useEffect, useRef } from 'react';

function makeRng(seed: number) {
  let s = seed >>> 0;
  return (lo = 0, hi = 1) => {
    s ^= s << 13; s ^= s >> 17; s ^= s << 5;
    return lo + ((s >>> 0) / 0xffffffff) * (hi - lo);
  };
}

const W = 640, H = 360, POOL = 1400, GRAV = 200;

export default function DemoCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;

    // ── Particle pool ─────────────────────────────────────────────────────
    const px = new Float32Array(POOL), py = new Float32Array(POOL);
    const pvx = new Float32Array(POOL), pvy = new Float32Array(POOL);
    const plife = new Float32Array(POOL), pmax = new Float32Array(POOL);
    const pr = new Uint8Array(POOL), pg = new Uint8Array(POOL), pb = new Uint8Array(POOL);
    const padd = new Uint8Array(POOL), pact = new Uint8Array(POOL);
    const psize = new Float32Array(POOL);
    let pIdx = 0;
    const alloc = () => { const i = pIdx; pIdx = (pIdx + 1) % POOL; return i; };

    const rng = makeRng(0xBEEF_CAFE);

    function genTerrain(seed: number) {
      const r = makeRng(seed);
      const h = new Int32Array(W);
      const layers = [
        { c: r(0.8, 1.8), p: r(0, Math.PI * 2), a: r(28, 50) },
        { c: r(2.5, 4.5), p: r(0, Math.PI * 2), a: r(10, 22) },
        { c: r(6,  10),   p: r(0, Math.PI * 2), a: r(3,   9) },
      ];
      for (let x = 0; x < W; x++) {
        let v = 280;
        for (const l of layers) v += Math.sin((x / W) * l.c * Math.PI * 2 + l.p) * l.a;
        h[x] = Math.max(200, Math.min(328, Math.round(v)));
      }
      return h;
    }

    function spawnBlast(cx: number, cy: number, big: boolean) {
      const nf = big ? 24 : 12;
      for (let i = 0; i < nf; i++) {
        const a = rng(0, Math.PI * 2), spd = rng(0, (big ? 48 : 26));
        const k = alloc();
        px[k] = cx; py[k] = cy; pvx[k] = Math.cos(a) * spd; pvy[k] = Math.sin(a) * spd;
        plife[k] = pmax[k] = rng(0.06, big ? 0.22 : 0.14);
        pr[k] = 255; pg[k] = 255; pb[k] = 220; padd[k] = 1; pact[k] = 1; psize[k] = big ? 4 : 2.5;
      }
      const nd = big ? 130 : 65;
      for (let i = 0; i < nd; i++) {
        const a = rng(0, Math.PI * 2), spd = rng(20, big ? 210 : 120);
        const k = alloc();
        px[k] = cx + rng(-4, 4); py[k] = cy + rng(-4, 4);
        pvx[k] = Math.cos(a) * spd; pvy[k] = Math.sin(a) * spd - rng(12, big ? 70 : 40);
        plife[k] = pmax[k] = rng(0.6, big ? 2.5 : 1.5);
        pr[k] = 255; pg[k] = rng(60, 200) | 0; pb[k] = 10;
        padd[k] = 0; pact[k] = 1; psize[k] = rng(1, big ? 4 : 2.8);
      }
      const ns = big ? 35 : 18;
      for (let i = 0; i < ns; i++) {
        const a = rng(-Math.PI, 0), spd = rng(5, 35);
        const k = alloc();
        px[k] = cx + rng(-10, 10); py[k] = cy;
        pvx[k] = Math.cos(a) * spd; pvy[k] = Math.sin(a) * spd - rng(6, 25);
        plife[k] = pmax[k] = rng(1.5, 4);
        const v = rng(40, 80) | 0; pr[k] = v; pg[k] = v; pb[k] = v;
        padd[k] = 0; pact[k] = 1; psize[k] = rng(3, big ? 14 : 8);
      }
    }

    function carve(heights: Int32Array, cx: number, cy: number, r: number) {
      for (let x = Math.max(0, (cx - r) | 0); x <= Math.min(W - 1, (cx + r) | 0); x++) {
        const dy = Math.sqrt(Math.max(0, r * r - (x - cx) ** 2)) | 0;
        const nf = (cy + dy) | 0;
        if (nf > heights[x]) heights[x] = Math.min(H - 5, nf);
      }
    }

    // ── State ─────────────────────────────────────────────────────────────
    let heights = genTerrain(Date.now());
    const tankX = [80, W - 80];
    const tankHP = [100, 100];
    const tankAngle = [45, 135];
    const COLORS   = ['#5090dc', '#dc4040'];
    const COLORSB  = ['#80b8ff', '#ff7070'];
    let shot: {x:number;y:number;vx:number;vy:number;life:number;trail:{x:number;y:number}[];type:number} | null = null;
    let subShells: {x:number;y:number;vx:number;vy:number;life:number;trail:{x:number;y:number}[]}[] = [];
    let wind = rng(-28, 28);
    let shotTimer = 1.5;
    let turn = 0;
    let roundN = 0;
    let shake = 0;
    let respawning = false;

    function surfaceY(t: number) { return heights[Math.max(0, Math.min(W - 1, tankX[t] | 0))]; }

    function fire(t: number) {
      const ang = tankAngle[t] * Math.PI / 180;
      const spd = rng(160, 210);
      shot = {
        x: tankX[t] + Math.cos(ang) * 8,
        y: surfaceY(t) - 14 - Math.sin(ang) * 8,
        vx: Math.cos(ang) * spd, vy: -Math.sin(ang) * spd,
        life: 6, trail: [], type: roundN % 4,
      };
    }

    function onImpact(ix: number, iy: number, big: boolean) {
      const r = big ? 42 : 24;
      carve(heights, ix, iy, r);
      spawnBlast(ix, iy, big);
      shake = big ? 20 : 9;
      // Cluster sub-shells
      if (shot && shot.type === 2) {
        for (let k = 0; k < 5; k++) {
          const a = (180 / 5 * k + 82) * Math.PI / 180;
          subShells.push({ x: ix, y: iy, vx: Math.cos(a) * 85, vy: Math.sin(a) * 85 - 45, life: 3, trail: [] });
        }
      }
      // Damage enemy
      const et = 1 - turn;
      const ex = tankX[et], ey = surfaceY(et) - 9;
      const dist = Math.hypot(ix - ex, iy - ey);
      const blastR = big ? 85 : 32;
      if (dist < blastR) {
        const dmg = Math.round(35 * (1 - dist / blastR) * (big ? 3.5 : 1));
        tankHP[et] = Math.max(0, tankHP[et] - dmg);
      }
      if (tankHP[et] <= 0 && !respawning) {
        respawning = true;
        setTimeout(() => {
          tankHP[0] = 100; tankHP[1] = 100; roundN++;
          heights = genTerrain(Date.now());
          respawning = false;
        }, 2200);
      }
    }

    function drawTerrain() {
      for (let x = 0; x < W; x++) {
        const top = heights[x];
        ctx.fillStyle = '#50aa3a'; ctx.fillRect(x, top, 1, 1);
        ctx.fillStyle = '#3a8830'; ctx.fillRect(x, top + 1, 1, 2);
        const g = ctx.createLinearGradient(0, top + 3, 0, H);
        g.addColorStop(0, '#6b4a28'); g.addColorStop(0.4, '#4a2e18'); g.addColorStop(1, '#200e08');
        ctx.fillStyle = g; ctx.fillRect(x, top + 3, 1, H - top - 3);
      }
    }

    function drawTank(t: number) {
      const x = tankX[t] | 0, y = surfaceY(t) | 0;
      ctx.fillStyle = 'rgba(0,0,0,0.35)'; ctx.fillRect(x - 11, y, 22, 3);
      ctx.fillStyle = t === 0 ? '#204070' : '#702020'; ctx.fillRect(x - 11, y - 4, 22, 4);
      ctx.fillStyle = COLORS[t]; ctx.fillRect(x - 9, y - 10, 18, 6);
      ctx.fillStyle = COLORSB[t]; ctx.fillRect(x - 5, y - 14, 10, 5);
      const ang = tankAngle[t] * Math.PI / 180;
      ctx.save(); ctx.translate(x, y - 12); ctx.rotate(-ang);
      ctx.fillStyle = '#304060'; ctx.fillRect(-1.5, -12, 3, 12); ctx.restore();
      // HP
      ctx.fillStyle = 'rgba(0,0,0,0.6)'; ctx.fillRect(x - 11, y - 19, 22, 3);
      ctx.fillStyle = tankHP[t] > 50 ? '#40d040' : tankHP[t] > 25 ? '#d0c020' : '#d02020';
      ctx.fillRect(x - 11, y - 19, 22 * tankHP[t] / 100, 3);
    }

    function drawShot(s: typeof shot | typeof subShells[0], color: string) {
      if (!s) return;
      for (let i = 0; i < s.trail.length; i++) {
        const a = (i / s.trail.length) * 0.75;
        ctx.globalCompositeOperation = 'lighter';
        ctx.fillStyle = `rgba(255,200,60,${a * 0.4})`;
        ctx.fillRect(s.trail[i].x - 1.5, s.trail[i].y - 1.5, 3, 3);
        ctx.globalCompositeOperation = 'source-over';
      }
      ctx.globalCompositeOperation = 'lighter';
      ctx.fillStyle = color; ctx.fillRect(s.x - 2.5, s.y - 2.5, 5, 5);
      ctx.fillStyle = 'rgba(255,220,80,0.18)';
      ctx.beginPath(); ctx.arc(s.x, s.y, 7, 0, Math.PI * 2); ctx.fill();
      ctx.globalCompositeOperation = 'source-over';
    }

    function drawParticles() {
      for (let i = 0; i < POOL; i++) {
        if (!pact[i]) continue;
        const a = plife[i] / pmax[i], sz = psize[i];
        if (padd[i]) {
          ctx.globalCompositeOperation = 'lighter';
          ctx.fillStyle = `rgba(${pr[i]},${pg[i]},${pb[i]},${a * 0.88})`;
        } else {
          ctx.globalCompositeOperation = 'source-over';
          ctx.fillStyle = `rgba(${pr[i]},${pg[i]},${pb[i]},${a * 0.82})`;
        }
        ctx.fillRect(px[i] - sz / 2, py[i] - sz / 2, sz, sz);
        ctx.globalCompositeOperation = 'source-over';
      }
    }

    function drawUI() {
      ctx.fillStyle = 'rgba(0,0,0,0.72)'; ctx.fillRect(0, 0, W, 16);
      ctx.fillStyle = COLORSB[0]; ctx.font = '6px "Press Start 2P",monospace'; ctx.fillText('P1', 4, 10);
      ctx.fillStyle = 'rgba(255,255,255,0.18)'; ctx.fillRect(18, 4, 65, 7);
      ctx.fillStyle = '#40d040'; ctx.fillRect(18, 4, 65 * tankHP[0] / 100, 7);
      ctx.fillStyle = COLORSB[1]; ctx.fillText('P2', W - 24, 10);
      ctx.fillStyle = 'rgba(255,255,255,0.18)'; ctx.fillRect(W - 88, 4, 65, 7);
      ctx.fillStyle = '#d02020'; ctx.fillRect(W - 88, 4, 65 * tankHP[1] / 100, 7);
      // Wind
      const wlen = Math.abs(wind) / 30 * 42, wd = wind >= 0 ? 1 : -1, wc = W / 2;
      ctx.strokeStyle = '#80ccff'; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(wc - wd * wlen / 2, 8); ctx.lineTo(wc + wd * wlen / 2, 8); ctx.stroke();
      ctx.fillStyle = '#80ccff';
      ctx.beginPath(); ctx.moveTo(wc + wd * wlen / 2, 5); ctx.lineTo(wc + wd * wlen / 2 + wd * 4, 8); ctx.lineTo(wc + wd * wlen / 2, 11); ctx.fill();
      ctx.fillStyle = COLORS[turn]; ctx.fillRect(W / 2 - 3, 0, 6, 16);
      ctx.fillStyle = 'rgba(255,255,255,0.4)'; ctx.font = '5px "Press Start 2P",monospace';
      ctx.fillText(`R${roundN + 1}`, W / 2 - 9, 10);
    }

    // ── Loop ──────────────────────────────────────────────────────────────
    let last = performance.now(), rafId = 0;

    function tick(now: number) {
      const dt = Math.min((now - last) / 1000, 0.05); last = now;
      shotTimer -= dt;
      if (!shot && subShells.length === 0 && shotTimer <= 0 && !respawning) {
        fire(turn); shotTimer = rng(2.5, 4.5);
      }

      if (shot) {
        shot.vx += wind * 0.5 * dt; shot.vy += GRAV * dt;
        shot.x  += shot.vx * dt;    shot.y  += shot.vy * dt;
        shot.life -= dt;
        shot.trail.push({ x: shot.x, y: shot.y });
        if (shot.trail.length > 24) shot.trail.shift();
        const ix = shot.x | 0, iy = shot.y | 0;
        const oob  = ix < -10 || ix > W + 10 || iy > H + 10 || shot.life <= 0;
        const hitT = ix >= 0 && ix < W && iy >= 0 && iy < H && iy >= heights[ix];
        const hitE = (() => { const et = 1 - turn; return Math.hypot(shot!.x - tankX[et], shot!.y - surfaceY(et) - 9) < 15; })();
        if (hitT || hitE) { onImpact(ix, iy, shot.type === 1); shot = null; wind = rng(-28, 28); turn = 1 - turn; }
        else if (oob)     { shot = null; wind = rng(-28, 28); turn = 1 - turn; }
      }

      for (let i = subShells.length - 1; i >= 0; i--) {
        const s = subShells[i];
        s.vx += wind * 0.3 * dt; s.vy += GRAV * dt;
        s.x  += s.vx * dt;       s.y  += s.vy * dt;
        s.life -= dt;
        s.trail.push({ x: s.x, y: s.y });
        if (s.trail.length > 14) s.trail.shift();
        const ix = s.x | 0, iy = s.y | 0;
        if (s.life <= 0 || ix < 0 || ix >= W || (iy >= 0 && iy < H && iy >= heights[ix])) {
          if (ix >= 0 && ix < W && iy >= 0 && iy < H) onImpact(ix, iy, false);
          subShells.splice(i, 1);
        }
      }

      for (let i = 0; i < POOL; i++) {
        if (!pact[i]) continue;
        plife[i] -= dt;
        if (plife[i] <= 0) { pact[i] = 0; continue; }
        if (!padd[i]) pvy[i] += 160 * 0.22 * dt;
        pvx[i] *= Math.pow(0.93, dt * 60); pvy[i] *= Math.pow(0.95, dt * 60);
        px[i]  += pvx[i] * dt; py[i]  += pvy[i] * dt;
        if (py[i] > H + 12 || px[i] < -25 || px[i] > W + 25) pact[i] = 0;
      }

      shake *= Math.pow(0.78, dt * 60);
      const sx = shake > 0.5 ? rng(-shake, shake) : 0;
      const sy = shake > 0.5 ? rng(-shake, shake) : 0;

      ctx.save();
      if (shake > 0.5) ctx.translate(sx, sy);

      const sky = ctx.createLinearGradient(0, 0, 0, H);
      sky.addColorStop(0, '#020208'); sky.addColorStop(0.55, '#060618'); sky.addColorStop(1, '#0c0610');
      ctx.fillStyle = sky; ctx.fillRect(-10, -10, W + 20, H + 20);

      ctx.fillStyle = 'rgba(200,210,255,0.55)';
      for (let si = 0; si < 70; si++) {
        ctx.fillRect((si * 127.1 + 31.3) % W, (si * 311.7 + 74.1) % (H * 0.5), 1, 1);
      }

      drawTerrain();
      drawParticles();
      for (let t = 0; t < 2; t++) drawTank(t);

      if (shot) {
        const COLS = ['#ffffa0', '#80ff80', '#ffc060', '#a0c0ff'];
        drawShot(shot, COLS[shot.type % 4]);
      }
      for (const s of subShells) drawShot(s, '#ffa020');

      drawUI();
      ctx.restore();
      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <canvas
      ref={ref}
      width={W}
      height={H}
      className="block w-full h-auto"
      style={{ imageRendering: 'pixelated' }}
    />
  );
}
