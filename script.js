'use strict';

// ── Starfield ─────────────────────────────────────────────────────────────
(function initStarfield() {
  const canvas = document.getElementById('starfield');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let stars = [];
  const NUM_STARS = 140;

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
    stars = Array.from({ length: NUM_STARS }, () => ({
      x:      Math.random() * canvas.width,
      y:      Math.random() * canvas.height,
      r:      Math.random() * 1.5 + 0.3,
      speed:  Math.random() * 0.3 + 0.05,
      alpha:  Math.random(),
      dalpha: (Math.random() - 0.5) * 0.01,
    }));
  }
  resize();
  window.addEventListener('resize', resize);

  function tick() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (const s of stars) {
      s.alpha = Math.max(0.1, Math.min(1, s.alpha + s.dalpha));
      if (s.alpha <= 0.1 || s.alpha >= 1) s.dalpha *= -1;

      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(200,210,255,${s.alpha})`;
      ctx.fill();
    }
    requestAnimationFrame(tick);
  }
  tick();
})();

// ── Demo Canvas — mini artillery simulation (320×180 logical) ────────────
(function initDemo() {
  const canvas = document.getElementById('demo');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  // Logical resolution matches the game: 320×180
  const W = 320, H = 180;

  // ── Terrain: three sine-wave layers ──────────────────────────────────────
  function generateTerrain(seed) {
    let rng = seed >>> 0;
    function next() {
      rng ^= rng << 13; rng ^= rng >> 17; rng ^= rng << 5;
      return (rng >>> 0) / 0xFFFFFFFF;
    }
    const rand = (lo, hi) => lo + next() * (hi - lo);

    const baseline = 145;

    const layers = [
      { cycles: rand(0.8, 1.8), phase: rand(0, Math.PI * 2), amp: rand(7, 11) },
      { cycles: rand(2.5, 4.5), phase: rand(0, Math.PI * 2), amp: rand(3,  6) },
      { cycles: rand(6.0, 10.), phase: rand(0, Math.PI * 2), amp: rand(1,  3) },
    ];

    const heights = new Int32Array(W);
    for (let x = 0; x < W; x++) {
      let h = baseline;
      for (const l of layers) {
        h += Math.sin((x / W) * l.cycles * 2 * Math.PI + l.phase) * l.amp;
      }
      heights[x] = Math.max(131, Math.min(161, Math.round(h)));
    }
    return heights;
  }

  // ── Particles ─────────────────────────────────────────────────────────────
  const POOL = 400;
  const px = new Float32Array(POOL), py = new Float32Array(POOL);
  const pvx = new Float32Array(POOL), pvy = new Float32Array(POOL);
  const plife = new Float32Array(POOL), pmaxlife = new Float32Array(POOL);
  const pr = new Uint8Array(POOL), pg = new Uint8Array(POOL), pb = new Uint8Array(POOL);
  const padd = new Uint8Array(POOL);
  const pactive = new Uint8Array(POOL);
  let poolIdx = 0;

  function allocParticle() {
    const i = poolIdx;
    poolIdx  = (poolIdx + 1) % POOL;
    return i;
  }

  let rngState = 0xBEEF42;
  function rand(lo, hi) {
    rngState ^= rngState << 13;
    rngState ^= rngState >> 17;
    rngState ^= rngState << 5;
    return lo + ((rngState >>> 0) / 0xFFFFFFFF) * (hi - lo);
  }

  function spawnExplosion(cx, cy, radius) {
    for (let i = 0; i < 8; i++) {
      const a = rand(0, Math.PI * 2), spd = rand(0, radius * 0.8);
      const idx = allocParticle();
      px[idx] = cx; py[idx] = cy;
      pvx[idx] = Math.cos(a) * spd; pvy[idx] = Math.sin(a) * spd;
      plife[idx] = pmaxlife[idx] = rand(0.06, 0.14);
      pr[idx] = 255; pg[idx] = 255; pb[idx] = 220;
      padd[idx] = 1; pactive[idx] = 1;
    }
    for (let i = 0; i < 50; i++) {
      const a = rand(0, Math.PI * 2), spd = rand(10, radius * 4);
      const idx = allocParticle();
      px[idx] = cx + rand(-2, 2); py[idx] = cy + rand(-2, 2);
      pvx[idx] = Math.cos(a) * spd; pvy[idx] = Math.sin(a) * spd - rand(5, 25);
      plife[idx] = pmaxlife[idx] = rand(0.5, 1.2);
      pr[idx] = 255; pg[idx] = rand(80, 200) | 0; pb[idx] = 10;
      padd[idx] = 0; pactive[idx] = 1;
    }
  }

  // ── Game state ────────────────────────────────────────────────────────────
  let heights  = generateTerrain(Date.now());
  let tankX    = [40, W - 40];
  let tankAngle= [45, 135];
  let shot     = null;
  let wind     = rand(-20, 20);
  let shotTimer= 0;
  let turn     = 0;
  const GRAVITY= 140;

  function fireTank(t) {
    const ang  = tankAngle[t] * Math.PI / 180;
    const spd  = 155;
    const ty   = heights[tankX[t]] - 6;
    shot = {
      x:  tankX[t] + Math.cos(ang) * 6,
      y:  ty       - Math.sin(ang) * 6,
      vx: Math.cos(ang) * spd,
      vy: -Math.sin(ang) * spd,
      life: 4,
      trail: [],
    };
  }

  // ── Render helpers ────────────────────────────────────────────────────────
  function drawTerrain() {
    for (let x = 0; x < W; x++) {
      const top = heights[x];
      ctx.fillStyle = '#5aa83a';
      ctx.fillRect(x, top, 1, 2);
      ctx.fillStyle = '#7d5834';
      ctx.fillRect(x, top + 2, 1, H - top - 2);
    }
  }

  function drawTank(t) {
    const x = tankX[t];
    const y = heights[x];
    ctx.fillStyle = t === 0 ? '#5090dc' : '#dc5050';
    ctx.fillRect(x - 6, y - 5, 12, 5);
    ctx.fillStyle = t === 0 ? '#70b0ff' : '#ff7070';
    ctx.fillRect(x - 3, y - 8, 6, 3);
    const ang = tankAngle[t] * Math.PI / 180;
    ctx.strokeStyle = '#303050';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(x, y - 7);
    ctx.lineTo(x + Math.cos(ang) * 7, y - 7 - Math.sin(ang) * 7);
    ctx.stroke();
  }

  function drawParticles() {
    for (let i = 0; i < POOL; i++) {
      if (!pactive[i]) continue;
      const alpha = plife[i] / pmaxlife[i];
      if (padd[i]) {
        ctx.globalCompositeOperation = 'lighter';
        ctx.fillStyle = `rgba(${pr[i]},${pg[i]},${pb[i]},${alpha * 0.85})`;
        ctx.fillRect(px[i] - 1, py[i] - 1, 2, 2);
        ctx.globalCompositeOperation = 'source-over';
      } else {
        ctx.fillStyle = `rgba(${pr[i]},${pg[i]},${pb[i]},${alpha * 0.9})`;
        ctx.fillRect(px[i] - 1, py[i] - 1, 2, 2);
      }
    }
  }

  function drawUI() {
    ctx.fillStyle = 'rgba(0,0,0,0.55)';
    ctx.fillRect(0, 0, W, 10);
    ctx.fillStyle = '#ffd740';
    ctx.font = '5px "Press Start 2P", monospace';
    ctx.fillText('P1', 3, 7);
    ctx.fillStyle = '#dc5050';
    ctx.fillText('P2', W - 16, 7);

    const wlen = Math.abs(wind) / 30 * 25;
    const wdir = wind >= 0 ? 1 : -1;
    ctx.strokeStyle = '#90b8ff';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(W / 2 - wdir * wlen / 2, 5);
    ctx.lineTo(W / 2 + wdir * wlen / 2, 5);
    ctx.stroke();
  }

  // ── Simulation tick ───────────────────────────────────────────────────────
  let last = performance.now();

  function tick(now) {
    const dt = Math.min((now - last) / 1000, 0.04);
    last = now;

    shotTimer -= dt;
    if (!shot && shotTimer <= 0) {
      fireTank(turn);
      shotTimer = 3.5;
    }

    if (shot) {
      shot.vx += wind * dt;
      shot.vy += GRAVITY * dt;
      shot.x  += shot.vx * dt;
      shot.y  += shot.vy * dt;
      shot.life -= dt;

      shot.trail.push({ x: shot.x, y: shot.y });
      if (shot.trail.length > 16) shot.trail.shift();

      const ix = shot.x | 0, iy = shot.y | 0;
      const hit = shot.life <= 0 ||
                  ix < 0 || ix >= W ||
                  (iy >= 0 && iy < H && iy >= heights[ix]);

      if (hit && ix >= 0 && ix < W && iy >= 0 && iy < H) {
        const R = 14;
        for (let x = ix - R; x <= ix + R; x++) {
          if (x < 0 || x >= W) continue;
          const dy = Math.sqrt(Math.max(0, R * R - (x - ix) ** 2)) | 0;
          const newFloor = (shot.y + dy) | 0;
          if (newFloor > heights[x]) heights[x] = Math.min(newFloor, H);
        }
        spawnExplosion(shot.x, shot.y, 14);
        shot = null;
        turn = 1 - turn;
        wind = rand(-20, 20);
      } else if (shot && (shot.life <= 0 || shot.x < -10 || shot.x > W + 10)) {
        shot = null;
        turn = 1 - turn;
        wind = rand(-20, 20);
      }
    }

    for (let i = 0; i < POOL; i++) {
      if (!pactive[i]) continue;
      plife[i] -= dt;
      if (plife[i] <= 0) { pactive[i] = 0; continue; }
      if (!padd[i]) pvy[i] += 140 * 0.35 * dt;
      pvx[i] *= Math.pow(0.95, dt * 60);
      pvy[i] *= Math.pow(0.95, dt * 60);
      px[i]  += pvx[i] * dt;
      py[i]  += pvy[i] * dt;
      if (py[i] > H + 5) pactive[i] = 0;
    }

    // ── Draw ─────────────────────────────────────────────────────────────
    const sky = ctx.createLinearGradient(0, 0, 0, H);
    sky.addColorStop(0, '#0a0a28');
    sky.addColorStop(1, '#1a1a50');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, W, H);

    drawTerrain();
    drawParticles();

    for (let t = 0; t < 2; t++) drawTank(t);

    if (shot) {
      for (let i = 0; i < shot.trail.length; i++) {
        const alpha = i / shot.trail.length * 0.6;
        ctx.fillStyle = `rgba(255,220,100,${alpha})`;
        ctx.fillRect(shot.trail[i].x - 1, shot.trail[i].y - 1, 2, 2);
      }
      ctx.fillStyle = '#ffffc0';
      ctx.fillRect(shot.x - 1.5, shot.y - 1.5, 3, 3);
    }

    drawUI();

    requestAnimationFrame(tick);
  }

  requestAnimationFrame(tick);
})();

// ── Weapon card hover glow ────────────────────────────────────────────────
document.querySelectorAll('.weapon-card').forEach(card => {
  card.addEventListener('mouseenter', () => {
    card.style.boxShadow = '0 0 24px rgba(255,107,53,0.25)';
  });
  card.addEventListener('mouseleave', () => {
    card.style.boxShadow = '';
  });
});

// ── Feature card stagger reveal on scroll ────────────────────────────────
const observer = new IntersectionObserver(entries => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 80);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.feature-card, .tech-item, .weapon-card').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(16px)';
  el.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
  observer.observe(el);
});

document.addEventListener('animationend', e => {
  if (e.target.classList.contains('feature-card') ||
      e.target.classList.contains('tech-item') ||
      e.target.classList.contains('weapon-card')) {
    e.target.style.opacity = '1';
    e.target.style.transform = 'none';
  }
});

// Add visible class style dynamically (avoids FOUC)
const style = document.createElement('style');
style.textContent = `.visible { opacity: 1 !important; transform: none !important; }`;
document.head.appendChild(style);
