'use strict';

// ══════════════════════════════════════════════════════════════════════════
//  Shared RNG
// ══════════════════════════════════════════════════════════════════════════
function makeRng(seed) {
  let s = seed >>> 0;
  return function(lo = 0, hi = 1) {
    s ^= s << 13; s ^= s >> 17; s ^= s << 5;
    return lo + ((s >>> 0) / 0xFFFFFFFF) * (hi - lo);
  };
}

// ══════════════════════════════════════════════════════════════════════════
//  Background hero canvas — starfield + embers + distant terrain
// ══════════════════════════════════════════════════════════════════════════
(function initBg() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const rng = makeRng(0xDEADBEEF);

  let W, H, stars = [], embers = [], mountains = [];

  function buildScene() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;

    // Stars
    stars = Array.from({ length: 200 }, () => ({
      x: rng(0, W), y: rng(0, H * 0.75),
      r: rng(0.3, 1.5),
      a: rng(0.2, 0.9),
      da: (rng() - 0.5) * 0.008,
    }));

    // Mountain silhouettes (3 layers)
    mountains = [0.55, 0.68, 0.78].map((baseY, li) => {
      const r2 = makeRng(0xABCD + li * 7);
      const pts = [];
      pts.push({ x: 0, y: H });
      const steps = 20 + li * 8;
      for (let i = 0; i <= steps; i++) {
        const x = (i / steps) * W;
        const peak = r2(0.3, 0.9);
        const y = H * (baseY - 0.1 * Math.sin(peak * Math.PI));
        const noise = r2(-0.04, 0.04);
        pts.push({ x, y: H * (baseY - 0.15 * Math.abs(Math.sin(i * 1.3 + li))) + noise * H });
      }
      pts.push({ x: W, y: H });
      const alpha = 0.15 + li * 0.12;
      const color = li === 0
        ? `rgba(10,10,30,${alpha})`
        : li === 1
        ? `rgba(8,14,24,${alpha + 0.05})`
        : `rgba(5,10,18,${alpha + 0.1})`;
      return { pts, color };
    });
  }

  buildScene();
  window.addEventListener('resize', buildScene);

  // Spawn ember
  function spawnEmber() {
    embers.push({
      x:  rng(W * 0.1, W * 0.9),
      y:  H * 0.95,
      vx: rng(-8, 8),
      vy: rng(-30, -70),
      life: 1,
      maxLife: rng(1.5, 4),
      size: rng(1, 3),
      hot: rng() > 0.6,
    });
  }

  let last = performance.now();
  let emberTimer = 0;

  function tick(now) {
    const dt = Math.min((now - last) / 1000, 0.05);
    last = now;

    // Clear
    ctx.clearRect(0, 0, W, H);

    // Sky gradient
    const sky = ctx.createLinearGradient(0, 0, 0, H);
    sky.addColorStop(0, '#02020a');
    sky.addColorStop(0.5, '#070714');
    sky.addColorStop(1, '#100818');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, W, H);

    // Distant glow on horizon
    const hglow = ctx.createRadialGradient(W * 0.5, H * 0.75, 0, W * 0.5, H * 0.75, W * 0.4);
    hglow.addColorStop(0, 'rgba(255,80,10,0.06)');
    hglow.addColorStop(1, 'transparent');
    ctx.fillStyle = hglow;
    ctx.fillRect(0, 0, W, H);

    // Stars
    for (const s of stars) {
      s.a += s.da;
      if (s.a > 0.9 || s.a < 0.1) s.da *= -1;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(200,210,255,${s.a})`;
      ctx.fill();
    }

    // Mountains
    for (const m of mountains) {
      ctx.beginPath();
      ctx.moveTo(m.pts[0].x, m.pts[0].y);
      for (let i = 1; i < m.pts.length; i++) {
        ctx.lineTo(m.pts[i].x, m.pts[i].y);
      }
      ctx.closePath();
      ctx.fillStyle = m.color;
      ctx.fill();
    }

    // Embers
    emberTimer -= dt;
    if (emberTimer <= 0) { spawnEmber(); emberTimer = rng(0.08, 0.25); }

    for (let i = embers.length - 1; i >= 0; i--) {
      const e = embers[i];
      e.x  += e.vx * dt;
      e.y  += e.vy * dt;
      e.vy += 10 * dt;  // slight gravity
      e.vx += rng(-5, 5) * dt;  // flicker
      e.life -= dt / e.maxLife;
      if (e.life <= 0) { embers.splice(i, 1); continue; }

      const a = e.life * 0.7;
      if (e.hot) {
        ctx.globalCompositeOperation = 'screen';
        ctx.fillStyle = `rgba(255,${120 + e.life * 80 | 0},20,${a})`;
      } else {
        ctx.globalCompositeOperation = 'source-over';
        ctx.fillStyle = `rgba(255,${60 + e.life * 60 | 0},0,${a * 0.5})`;
      }
      ctx.beginPath();
      ctx.arc(e.x, e.y, e.size * e.life, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalCompositeOperation = 'source-over';
    }

    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
})();

// ══════════════════════════════════════════════════════════════════════════
//  Demo canvas — TerraShell Fracture simulation
// ══════════════════════════════════════════════════════════════════════════
(function initDemo() {
  const canvas = document.getElementById('demo');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = 640, H = 360;

  // ── RNG ─────────────────────────────────────────────────────────────────
  let seed = 0xBEEF42;
  function rng(lo = 0, hi = 1) {
    seed ^= seed << 13; seed ^= seed >> 17; seed ^= seed << 5;
    return lo + ((seed >>> 0) / 0xFFFFFFFF) * (hi - lo);
  }

  // ── Terrain generation ───────────────────────────────────────────────────
  function generateTerrain(s) {
    const r = makeRng(s);
    const heights = new Int32Array(W);
    const base = 280;
    const layers = [
      { c: r(0.8, 1.8), p: r(0, Math.PI * 2), a: r(25, 45) },
      { c: r(2.5, 4.5), p: r(0, Math.PI * 2), a: r(10, 20) },
      { c: r(6,  10),   p: r(0, Math.PI * 2), a: r(3,  8)  },
    ];
    for (let x = 0; x < W; x++) {
      let h = base;
      for (const l of layers) h += Math.sin((x / W) * l.c * Math.PI * 2 + l.p) * l.a;
      heights[x] = Math.max(200, Math.min(320, Math.round(h)));
    }
    return heights;
  }

  // ── Particle pool ────────────────────────────────────────────────────────
  const POOL = 1200;
  const px    = new Float32Array(POOL), py    = new Float32Array(POOL);
  const pvx   = new Float32Array(POOL), pvy   = new Float32Array(POOL);
  const plife = new Float32Array(POOL), pmax  = new Float32Array(POOL);
  const pr    = new Uint8Array(POOL),   pg    = new Uint8Array(POOL);
  const pb    = new Uint8Array(POOL),   padd  = new Uint8Array(POOL);
  const pact  = new Uint8Array(POOL),   psize = new Float32Array(POOL);
  let   pIdx  = 0;

  function alloc() { const i = pIdx; pIdx = (pIdx + 1) % POOL; return i; }

  function spawnBlast(cx, cy, radius, big) {
    // Additive flash
    const nf = big ? 20 : 10;
    for (let i = 0; i < nf; i++) {
      const a = rng(0, Math.PI * 2), spd = rng(0, radius * 1.2);
      const k = alloc();
      px[k]=cx; py[k]=cy; pvx[k]=Math.cos(a)*spd; pvy[k]=Math.sin(a)*spd;
      plife[k]=pmax[k]=rng(0.06, big?0.2:0.12);
      pr[k]=255; pg[k]=255; pb[k]=220; padd[k]=1; pact[k]=1; psize[k]=big?3:2;
    }
    // Orange debris
    const nd = big ? 120 : 60;
    for (let i = 0; i < nd; i++) {
      const a = rng(0, Math.PI * 2), spd = rng(20, radius * (big?6:4));
      const k = alloc();
      px[k]=cx+rng(-3,3); py[k]=cy+rng(-3,3);
      pvx[k]=Math.cos(a)*spd; pvy[k]=Math.sin(a)*spd - rng(10, big?60:35);
      plife[k]=pmax[k]=rng(0.6, big?2.2:1.4);
      pr[k]=255; pg[k]=rng(60,200)|0; pb[k]=10;
      padd[k]=0; pact[k]=1; psize[k]=rng(1,big?3.5:2.5);
    }
    // Smoke
    const ns = big ? 30 : 15;
    for (let i = 0; i < ns; i++) {
      const a = rng(-Math.PI, 0), spd = rng(5, 30);
      const k = alloc();
      px[k]=cx+rng(-8,8); py[k]=cy;
      pvx[k]=Math.cos(a)*spd; pvy[k]=Math.sin(a)*spd - rng(5,20);
      plife[k]=pmax[k]=rng(1.5,3.5);
      const v = rng(40,80)|0; pr[k]=v; pg[k]=v; pb[k]=v;
      padd[k]=0; pact[k]=1; psize[k]=rng(3, big?12:7);
    }
  }

  // ── Crater carving ───────────────────────────────────────────────────────
  function carve(heights, cx, cy, r) {
    for (let x = Math.max(0, cx - r | 0); x <= Math.min(W - 1, cx + r | 0); x++) {
      const dy = Math.sqrt(Math.max(0, r * r - (x - cx) ** 2)) | 0;
      const newFloor = (cy + dy) | 0;
      if (newFloor > heights[x]) heights[x] = Math.min(H - 5, newFloor);
    }
  }

  // ── Game state ───────────────────────────────────────────────────────────
  let heights   = generateTerrain(Date.now());
  let tankX     = [80, W - 80];
  let tankHP    = [100, 100];
  let tankAngle = [45, 135];
  let shot      = null;
  let wind      = rng(-25, 25);
  let shotTimer = 1.5;
  let turn      = 0;
  let roundN    = 0;
  const GRAV    = 200;
  const COLORS  = ['#5090dc', '#dc4040'];
  const COLORSB = ['#80b8ff', '#ff6060'];

  // Sub-shells
  let subShells = [];

  function positionTank(t) {
    tankX[t] = Math.max(24, Math.min(W - 24, tankX[t]));
    return heights[Math.max(0, Math.min(W - 1, tankX[t] | 0))];
  }

  function fireTank(t) {
    const ang = tankAngle[t] * Math.PI / 180;
    const spd = rng(160, 200);
    const ty  = positionTank(t) - 14;
    shot = {
      x:  tankX[t] + Math.cos(ang) * 8,
      y:  ty        - Math.sin(ang) * 8,
      vx: Math.cos(ang) * spd,
      vy: -Math.sin(ang) * spd,
      life: 6,
      trail: [],
      type: roundN % 4,  // cycle weapon types visually
    };
  }

  function onImpact(ix, iy, big) {
    const r = big ? 38 : 22;
    carve(heights, ix, iy, r);
    spawnBlast(ix, iy, r, big);
    // Cluster sub-shells
    if (shot && shot.type === 2) {
      for (let k = 0; k < 5; k++) {
        const a = (180 / 5 * k + 80) * Math.PI / 180;
        subShells.push({
          x: ix, y: iy,
          vx: Math.cos(a) * 80,
          vy: Math.sin(a) * 80 - 40,
          life: 3, trail: [],
        });
      }
    }
  }

  // Screen shake
  let shake = 0;

  // ── Render helpers ────────────────────────────────────────────────────────
  function drawTerrain() {
    // Grass top
    for (let x = 0; x < W; x++) {
      const top = heights[x];
      // Surface glow
      ctx.fillStyle = '#3a8c2a';
      ctx.fillRect(x, top, 1, 3);
      ctx.fillStyle = '#50aa3a';
      ctx.fillRect(x, top, 1, 1);
      // Earth
      const grad = ctx.createLinearGradient(0, top + 3, 0, H);
      grad.addColorStop(0, '#6b4c2a');
      grad.addColorStop(0.3, '#4a3020');
      grad.addColorStop(1, '#2a1a10');
      ctx.fillStyle = grad;
      ctx.fillRect(x, top + 3, 1, H - top - 3);
    }
  }

  function drawTank(t) {
    const x = tankX[t] | 0;
    const y = positionTank(t) | 0;
    const hp = tankHP[t] / 100;

    // Shadow
    ctx.fillStyle = 'rgba(0,0,0,0.4)';
    ctx.fillRect(x - 10, y, 20, 3);

    // Tracks
    ctx.fillStyle = t === 0 ? '#204070' : '#702020';
    ctx.fillRect(x - 10, y - 4, 20, 4);

    // Hull
    ctx.fillStyle = COLORS[t];
    ctx.fillRect(x - 9, y - 9, 18, 6);

    // Turret
    ctx.fillStyle = COLORSB[t];
    ctx.fillRect(x - 5, y - 13, 10, 5);

    // Barrel
    const ang = tankAngle[t] * Math.PI / 180;
    ctx.save();
    ctx.translate(x, y - 11);
    ctx.rotate(-ang + Math.PI * 0.5 * (t === 0 ? 0 : 2));
    ctx.fillStyle = '#304060';
    ctx.fillRect(-1.5, -10, 3, 10);
    ctx.restore();

    // HP bar
    ctx.fillStyle = 'rgba(0,0,0,0.6)';
    ctx.fillRect(x - 10, y - 18, 20, 3);
    ctx.fillStyle = hp > 0.5 ? '#40d040' : hp > 0.25 ? '#d0c020' : '#d02020';
    ctx.fillRect(x - 10, y - 18, 20 * hp, 3);
  }

  function drawShot(s, color) {
    // Trail
    for (let i = 0; i < s.trail.length; i++) {
      const a = (i / s.trail.length) * 0.8;
      ctx.globalCompositeOperation = 'lighter';
      ctx.fillStyle = `rgba(255,200,60,${a * 0.4})`;
      ctx.fillRect(s.trail[i].x - 1.5, s.trail[i].y - 1.5, 3, 3);
      ctx.globalCompositeOperation = 'source-over';
    }
    // Bullet
    ctx.globalCompositeOperation = 'lighter';
    ctx.fillStyle = color || '#ffffa0';
    ctx.fillRect(s.x - 2.5, s.y - 2.5, 5, 5);
    // Glow
    ctx.fillStyle = 'rgba(255,220,80,0.2)';
    ctx.beginPath();
    ctx.arc(s.x, s.y, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalCompositeOperation = 'source-over';
  }

  function drawParticles() {
    for (let i = 0; i < POOL; i++) {
      if (!pact[i]) continue;
      const a = plife[i] / pmax[i];
      const sz = psize[i];
      if (padd[i]) {
        ctx.globalCompositeOperation = 'lighter';
        ctx.fillStyle = `rgba(${pr[i]},${pg[i]},${pb[i]},${a * 0.9})`;
        ctx.fillRect(px[i] - sz / 2, py[i] - sz / 2, sz, sz);
        ctx.globalCompositeOperation = 'source-over';
      } else {
        ctx.fillStyle = `rgba(${pr[i]},${pg[i]},${pb[i]},${a * 0.85})`;
        ctx.fillRect(px[i] - sz / 2, py[i] - sz / 2, sz, sz);
      }
    }
  }

  function drawUI() {
    // Top bar
    ctx.fillStyle = 'rgba(0,0,0,0.65)';
    ctx.fillRect(0, 0, W, 14);

    // P1 label + HP
    ctx.fillStyle = COLORSB[0];
    ctx.font = '6px "Press Start 2P", monospace';
    ctx.fillText('P1', 4, 9);
    ctx.fillStyle = 'rgba(255,255,255,0.2)';
    ctx.fillRect(18, 4, 60, 6);
    ctx.fillStyle = '#40d040';
    ctx.fillRect(18, 4, 60 * tankHP[0] / 100, 6);

    // P2 label + HP
    ctx.fillStyle = COLORSB[1];
    ctx.fillText('P2', W - 22, 9);
    ctx.fillStyle = 'rgba(255,255,255,0.2)';
    ctx.fillRect(W - 84, 4, 60, 6);
    ctx.fillStyle = '#d02020';
    ctx.fillRect(W - 84, 4, 60 * tankHP[1] / 100, 6);

    // Wind arrow
    const wlen = Math.abs(wind) / 30 * 40;
    const wdir = wind >= 0 ? 1 : -1;
    const wCx  = W / 2;
    ctx.strokeStyle = '#90ccff';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(wCx - wdir * wlen / 2, 7);
    ctx.lineTo(wCx + wdir * wlen / 2, 7);
    ctx.stroke();
    // arrowhead
    ctx.fillStyle = '#90ccff';
    ctx.beginPath();
    ctx.moveTo(wCx + wdir * wlen / 2, 4);
    ctx.lineTo(wCx + wdir * wlen / 2 + wdir * 4, 7);
    ctx.lineTo(wCx + wdir * wlen / 2, 10);
    ctx.fill();

    // Turn indicator
    ctx.fillStyle = COLORS[turn];
    ctx.fillRect(W / 2 - 3, 0, 6, 14);

    // Round number
    ctx.fillStyle = 'rgba(255,255,255,0.4)';
    ctx.font = '5px "Press Start 2P", monospace';
    ctx.fillText(`R${roundN + 1}`, W / 2 - 8, 9);
  }

  // ── Main simulation loop ─────────────────────────────────────────────────
  let last = performance.now();

  function tick(now) {
    const rawDt = Math.min((now - last) / 1000, 0.05);
    last = now;
    const dt = rawDt;

    // Fire scheduling
    shotTimer -= dt;
    if (!shot && subShells.length === 0 && shotTimer <= 0) {
      fireTank(turn);
      shotTimer = rng(2.5, 4.5);
    }

    // Update main shot
    if (shot) {
      shot.vx += wind * 0.5 * dt;
      shot.vy += GRAV * dt;
      shot.x  += shot.vx * dt;
      shot.y  += shot.vy * dt;
      shot.life -= dt;

      shot.trail.push({ x: shot.x, y: shot.y });
      if (shot.trail.length > 22) shot.trail.shift();

      const ix = shot.x | 0, iy = shot.y | 0;
      const outOfBounds = ix < -10 || ix > W + 10 || iy > H + 10 || shot.life <= 0;
      const hitTerrain  = ix >= 0 && ix < W && iy >= 0 && iy < H && iy >= heights[ix];
      const hitEnemy    = (() => {
        const et = 1 - turn;
        const ex = tankX[et], ey = positionTank(et) - 8;
        return Math.hypot(shot.x - ex, shot.y - ey) < 14;
      })();

      if (hitTerrain || hitEnemy || outOfBounds) {
        if (!outOfBounds) {
          onImpact(ix, iy, shot.type === 1 /* nuke */);
          shake = hitEnemy ? 12 : shot.type === 1 ? 18 : 8;
          // Apply damage
          const et = 1 - turn;
          const ex = tankX[et], ey = positionTank(et) - 8;
          const dist = Math.hypot(ix - ex, iy - ey);
          const r = shot.type === 1 ? 80 : 30;
          if (dist < r) {
            const dmg = Math.round(30 * (1 - dist / r) * (shot.type === 1 ? 3 : 1));
            tankHP[et] = Math.max(0, tankHP[et] - dmg);
          }
          // Respawn if dead
          if (tankHP[et] <= 0) {
            setTimeout(() => {
              tankHP = [100, 100];
              heights = generateTerrain(Date.now());
              roundN++;
            }, 1800);
          }
        }
        shot = null;
        if (shot === null) {  // only advance turn when subs are done
          // turn advances after subs land
        }
        wind = rng(-25, 25);
      }
    }

    // Update sub-shells
    for (let i = subShells.length - 1; i >= 0; i--) {
      const s = subShells[i];
      s.vx += wind * 0.3 * dt;
      s.vy += GRAV * dt;
      s.x  += s.vx * dt;
      s.y  += s.vy * dt;
      s.life -= dt;
      s.trail.push({ x: s.x, y: s.y });
      if (s.trail.length > 12) s.trail.shift();

      const ix = s.x | 0, iy = s.y | 0;
      const hit = s.life <= 0 || ix < 0 || ix >= W ||
                  (iy >= 0 && iy < H && iy >= heights[ix]);
      if (hit) {
        if (ix >= 0 && ix < W && iy >= 0 && iy < H)
          onImpact(ix, iy, false);
        subShells.splice(i, 1);
      }
    }

    if (!shot && subShells.length === 0) {
      turn = 1 - turn;
    }

    // Update particles
    for (let i = 0; i < POOL; i++) {
      if (!pact[i]) continue;
      plife[i] -= dt;
      if (plife[i] <= 0) { pact[i] = 0; continue; }
      if (!padd[i]) pvy[i] += 160 * 0.25 * dt;
      pvx[i] *= Math.pow(0.93, dt * 60);
      pvy[i] *= Math.pow(0.95, dt * 60);
      px[i]  += pvx[i] * dt;
      py[i]  += pvy[i] * dt;
      if (py[i] > H + 10 || px[i] < -20 || px[i] > W + 20) pact[i] = 0;
    }

    // Decay shake
    shake *= Math.pow(0.8, dt * 60);
    const sx = shake > 0.5 ? rng(-shake, shake) : 0;
    const sy = shake > 0.5 ? rng(-shake, shake) : 0;

    // ── Draw ─────────────────────────────────────────────────────────────
    ctx.save();
    if (shake > 0.5) ctx.translate(sx, sy);

    // Sky
    const sky = ctx.createLinearGradient(0, 0, 0, H);
    sky.addColorStop(0, '#030310');
    sky.addColorStop(0.5, '#070720');
    sky.addColorStop(1, '#0c0818');
    ctx.fillStyle = sky;
    ctx.fillRect(-10, -10, W + 20, H + 20);

    // Stars (static tiny)
    ctx.fillStyle = 'rgba(200,210,255,0.6)';
    for (let si = 0; si < 60; si++) {
      const sx2 = (si * 127.1 + 31.3) % W;
      const sy2 = (si * 311.7 + 74.1) % (H * 0.5);
      ctx.fillRect(sx2, sy2, 1, 1);
    }

    drawTerrain();
    drawParticles();

    for (let t = 0; t < 2; t++) drawTank(t);

    if (shot) {
      const SHOT_COLORS = ['#ffffa0', '#80ff80', '#ffc040', '#a0c0ff'];
      drawShot(shot, SHOT_COLORS[shot.type % 4]);
    }
    for (const s of subShells) drawShot(s, '#ffa020');

    drawUI();

    ctx.restore();
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
})();

// ══════════════════════════════════════════════════════════════════════════
//  Download section — ambient explosion canvas
// ══════════════════════════════════════════════════════════════════════════
(function initExplosionBg() {
  const canvas = document.getElementById('explosion-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const rng = makeRng(0xCAFEBABE);

  let W, H;
  const sparks = [];

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  function spawnBurst(cx, cy) {
    for (let i = 0; i < 30; i++) {
      const a = rng(0, Math.PI * 2);
      const spd = rng(30, 150);
      sparks.push({
        x: cx, y: cy,
        vx: Math.cos(a) * spd, vy: Math.sin(a) * spd,
        life: 1, maxLife: rng(0.6, 2.5),
        size: rng(1, 4),
        r: 255, g: rng(60, 220) | 0, b: 0,
      });
    }
  }

  let burstTimer = 0;
  let last = performance.now();

  function tick(now) {
    const dt = Math.min((now - last) / 1000, 0.05);
    last = now;

    burstTimer -= dt;
    if (burstTimer <= 0) {
      spawnBurst(rng(W * 0.1, W * 0.9), rng(H * 0.2, H * 0.8));
      burstTimer = rng(1.5, 3.5);
    }

    ctx.clearRect(0, 0, W, H);

    for (let i = sparks.length - 1; i >= 0; i--) {
      const s = sparks[i];
      s.x    += s.vx * dt;
      s.y    += s.vy * dt;
      s.vy   += 80 * dt;
      s.vx   *= Math.pow(0.97, dt * 60);
      s.life -= dt / s.maxLife;
      if (s.life <= 0) { sparks.splice(i, 1); continue; }
      const a = s.life * 0.5;
      ctx.globalCompositeOperation = 'screen';
      ctx.fillStyle = `rgba(${s.r},${s.g},${s.b},${a})`;
      ctx.fillRect(s.x - s.size / 2, s.y - s.size / 2, s.size, s.size);
      ctx.globalCompositeOperation = 'source-over';
    }
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
})();

// ══════════════════════════════════════════════════════════════════════════
//  Footer terrain silhouette
// ══════════════════════════════════════════════════════════════════════════
(function initFooterTerrain() {
  const div = document.getElementById('footer-terrain');
  if (!div) return;
  const canvas = document.createElement('canvas');
  canvas.style.width = '100%';
  canvas.style.height = '40px';
  canvas.style.display = 'block';
  div.appendChild(canvas);
  const ctx = canvas.getContext('2d');
  const rng = makeRng(0xF00D);

  function draw() {
    const W = canvas.width  = div.offsetWidth;
    const H = canvas.height = 40;
    ctx.clearRect(0, 0, W, H);
    ctx.beginPath();
    ctx.moveTo(0, H);
    for (let x = 0; x <= W; x += 4) {
      const y = H * 0.5 + Math.sin(x / W * Math.PI * 6 + 1.2) * H * 0.3
                         + Math.sin(x / W * Math.PI * 13 + 0.5) * H * 0.1;
      ctx.lineTo(x, y);
    }
    ctx.lineTo(W, H);
    ctx.closePath();
    const grad = ctx.createLinearGradient(0, 0, 0, H);
    grad.addColorStop(0, '#2a6a1a');
    grad.addColorStop(0.4, '#1a3a10');
    grad.addColorStop(1, '#0a1508');
    ctx.fillStyle = grad;
    ctx.fill();
  }
  draw();
  window.addEventListener('resize', draw);
})();

// ══════════════════════════════════════════════════════════════════════════
//  Nav burger
// ══════════════════════════════════════════════════════════════════════════
(function initNav() {
  const burger = document.getElementById('burger');
  const links  = document.querySelector('.nav-links');
  if (!burger || !links) return;
  burger.addEventListener('click', () => {
    links.classList.toggle('open');
  });
  links.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => links.classList.remove('open'));
  });
})();

// ══════════════════════════════════════════════════════════════════════════
//  Scroll reveal with stagger
// ══════════════════════════════════════════════════════════════════════════
(function initReveal() {
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const siblings = entry.target.parentElement
        ? Array.from(entry.target.parentElement.querySelectorAll('.reveal'))
        : [entry.target];
      const idx = siblings.indexOf(entry.target);
      setTimeout(() => entry.target.classList.add('visible'), idx * 80);
      io.unobserve(entry.target);
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.reveal').forEach(el => io.observe(el));
})();

// ══════════════════════════════════════════════════════════════════════════
//  Weapon card mouse-track glow
// ══════════════════════════════════════════════════════════════════════════
document.querySelectorAll('.wcard').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    card.style.setProperty('--mx', `${x}px`);
    card.style.setProperty('--my', `${y}px`);
    card.style.background = `radial-gradient(circle at ${x}px ${y}px, #1c1c3c, #10102c 60%)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.background = '';
  });
});

// ══════════════════════════════════════════════════════════════════════════
//  Animate stat bars when visible
// ══════════════════════════════════════════════════════════════════════════
(function initBars() {
  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.querySelectorAll('.wbar-fill').forEach(fill => {
        const pct = fill.style.getPropertyValue('--pct') || '0%';
        fill.style.setProperty('--pct', '0%');
        requestAnimationFrame(() => {
          fill.style.transition = 'width 1s cubic-bezier(.22,.68,0,1.2)';
          fill.style.setProperty('--pct', pct);
        });
      });
      io.unobserve(entry.target);
    });
  }, { threshold: 0.3 });
  document.querySelectorAll('.wcard').forEach(c => io.observe(c));
})();
