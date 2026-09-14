/**
 * Anime Cutscene Engine - Dual Awakening Specials
 * 1. Demon Slayer: Tanjiro Slashing Blade Cross-Slash
 *    - Slash 1: Moving from Right-Up corner to Left-Down corner
 *    - Slash 2: Moving from Left-Up corner to Right-Down corner
 *    - Trailing Hinokami Kagura solar fire, embers, and blade slash beam
 * 2. Blue Lock: Isagi Direct Shot Dual Volley
 *    - Kick 1: Ball rockets from Left-Bottom corner to Right-Up corner
 *    - Kick 2: Ball rockets from Right-Bottom corner to Left-Up corner
 *    - Trailing Metavision flow aura, shattering puzzle pieces, and sonic shockwaves
 */

class AnimeCutsceneEngine {
  constructor() {
    this.canvas = null;
    this.ctx = null;
    this.width = 0;
    this.height = 0;
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);

    this.isPlaying = false;
    this.animationFrameId = null;
    this.startTime = 0;
    this.cutsceneType = null; // 'demonslayer' | 'bluelock'

    // Sprites
    this.images = {
      tanjiro: null,
      isagi: null,
      ball: null
    };
    this.imagesLoaded = false;

    this.particles = [];
    this.slashTrails = [];
    this.shockwaves = [];
    this.puzzleShards = [];

    this.init();
  }

  init() {
    // 1. Create dedicated high-priority overlay canvas
    this.canvas = document.createElement('canvas');
    this.canvas.id = 'animeCutsceneCanvas';
    this.canvas.style.position = 'fixed';
    this.canvas.style.inset = '0';
    this.canvas.style.width = '100vw';
    this.canvas.style.height = '100vh';
    this.canvas.style.pointerEvents = 'none';
    this.canvas.style.zIndex = '99999';
    this.canvas.style.display = 'none';
    document.body.appendChild(this.canvas);

    this.ctx = this.canvas.getContext('2d');
    this.resize();
    window.addEventListener('resize', () => this.resize(), { passive: true });

    // 2. Preload action sprites
    this.preloadSprites();
  }

  resize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    if (this.canvas) {
      this.canvas.width = Math.floor(this.width * this.dpr);
      this.canvas.height = Math.floor(this.height * this.dpr);
    }
  }

  preloadSprites() {
    let loadedCount = 0;
    const sources = {
      tanjiro: 'assets/tanjiro_slash.png',
      isagi: 'assets/isagi_kick.png',
      ball: 'assets/bluelock_ball.png'
    };

    for (const [key, src] of Object.entries(sources)) {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        this.images[key] = img;
        loadedCount++;
        if (loadedCount === 3) this.imagesLoaded = true;
      };
    }
  }

  triggerAwakening(theme) {
    this.cutsceneType = theme;
    this.isPlaying = true;
    this.startTime = performance.now();
    this.particles = [];
    this.slashTrails = [];
    this.shockwaves = [];
    this.puzzleShards = [];

    this.canvas.style.display = 'block';

    // Screen Shake
    document.body.classList.remove('screen-shake-intense');
    void document.body.offsetWidth; // trigger reflow
    setTimeout(() => {
      document.body.classList.add('screen-shake-intense');
      setTimeout(() => document.body.classList.remove('screen-shake-intense'), 500);
    }, 450);

    if (this.animationFrameId) cancelAnimationFrame(this.animationFrameId);
    this.loop(this.startTime);
  }

  loop(currentTime) {
    if (!this.isPlaying) return;

    const elapsed = currentTime - this.startTime;
    const duration = 2000; // 2.0s total cutscene duration

    if (elapsed > duration) {
      this.stop();
      return;
    }

    this.ctx.save();
    this.ctx.scale(this.dpr, this.dpr);
    this.ctx.clearRect(0, 0, this.width, this.height);

    if (this.cutsceneType === 'demonslayer') {
      this.renderDemonSlayerCutscene(elapsed);
    } else {
      this.renderBlueLockCutscene(elapsed);
    }

    this.ctx.restore();
    this.animationFrameId = requestAnimationFrame((t) => this.loop(t));
  }

  stop() {
    this.isPlaying = false;
    if (this.animationFrameId) cancelAnimationFrame(this.animationFrameId);
    if (this.ctx) {
      this.ctx.clearRect(0, 0, this.width * this.dpr, this.height * this.dpr);
    }
    this.canvas.style.display = 'none';
  }

  // =========================================================================
  // DEMON SLAYER CUTSCENE: TANJIRO HINOKAMI KAGURA CROSS-SLASH
  // 1. Slash 1: Right-Up corner -> Left-Down corner
  // 2. Slash 2: Left-Up corner -> Right-Down corner
  // =========================================================================
  renderDemonSlayerCutscene(elapsed) {
    const W = this.width;
    const H = this.height;

    // --- Slash 1 (Right-Up -> Left-Down) from t = 0 to 650ms ---
    const t1 = elapsed / 600.0;
    if (t1 >= 0 && t1 <= 1.4) {
      const progress = Math.min(Math.max(t1, 0), 1);
      // Ease out cubic
      const ease = 1 - Math.pow(1 - progress, 3);

      const startX = W + 120;
      const startY = -80;
      const endX = -220;
      const endY = H + 180;

      const curX = startX + (endX - startX) * ease;
      const curY = startY + (endY - startY) * ease;

      // Add trail point
      if (progress < 1) {
        this.slashTrails.push({
          x: curX + 40,
          y: curY + 60,
          type: 'fire',
          color: [255, 75, 0],
          size: 45 + Math.random() * 25,
          alpha: 1.0,
          created: elapsed
        });

        // Spawn flame embers
        for (let i = 0; i < 4; i++) {
          this.particles.push({
            x: curX + Math.random() * 60 - 30,
            y: curY + Math.random() * 60 - 30,
            vx: (Math.random() - 0.5) * 6 - 3,
            vy: (Math.random() - 0.5) * 6 + 2,
            size: 3 + Math.random() * 5,
            color: [255, Math.floor(130 + Math.random() * 125), 10],
            alpha: 1.0,
            decay: 0.02 + Math.random() * 0.02
          });
        }
      }

      // Draw Tanjiro Sprite moving downward-left
      if (this.images.tanjiro && progress < 1.1) {
        this.ctx.save();
        this.ctx.translate(curX, curY);
        // Angle pointing towards bottom-left
        const angle = Math.atan2(endY - startY, endX - startX);
        this.ctx.rotate(angle + Math.PI * 0.25);
        this.ctx.shadowColor = 'rgba(255, 69, 0, 0.9)';
        this.ctx.shadowBlur = 35;
        const sprW = 260;
        const sprH = 208;
        this.ctx.drawImage(this.images.tanjiro, -sprW * 0.5, -sprH * 0.5, sprW, sprH);
        this.ctx.restore();
      }
    }

    // --- Slash 2 (Left-Up -> Right-Down) from t = 280ms to 920ms ---
    const t2 = (elapsed - 280) / 600.0;
    if (t2 >= 0 && t2 <= 1.4) {
      const progress = Math.min(Math.max(t2, 0), 1);
      const ease = 1 - Math.pow(1 - progress, 3);

      const startX = -150;
      const startY = -80;
      const endX = W + 220;
      const endY = H + 180;

      const curX = startX + (endX - startX) * ease;
      const curY = startY + (endY - startY) * ease;

      if (progress < 1) {
        this.slashTrails.push({
          x: curX - 40,
          y: curY + 60,
          type: 'sun',
          color: [255, 180, 0],
          size: 45 + Math.random() * 25,
          alpha: 1.0,
          created: elapsed
        });

        for (let i = 0; i < 4; i++) {
          this.particles.push({
            x: curX + Math.random() * 60 - 30,
            y: curY + Math.random() * 60 - 30,
            vx: (Math.random() - 0.5) * 6 + 3,
            vy: (Math.random() - 0.5) * 6 + 2,
            size: 3 + Math.random() * 5,
            color: [255, Math.floor(180 + Math.random() * 75), 20],
            alpha: 1.0,
            decay: 0.02 + Math.random() * 0.02
          });
        }
      }

      if (this.images.tanjiro && progress < 1.1) {
        this.ctx.save();
        this.ctx.translate(curX, curY);
        // Flip horizontally to face right
        this.ctx.scale(-1, 1);
        const angle = Math.atan2(endY - startY, -(endX - startX));
        this.ctx.rotate(angle - Math.PI * 0.25);
        this.ctx.shadowColor = 'rgba(255, 183, 3, 0.9)';
        this.ctx.shadowBlur = 35;
        const sprW = 260;
        const sprH = 208;
        this.ctx.drawImage(this.images.tanjiro, -sprW * 0.5, -sprH * 0.5, sprW, sprH);
        this.ctx.restore();
      }
    }

    // --- Render Fiery Slash Beams & Trails ---
    this.renderSlashTrails();

    // --- Intersection Cross Burst at t = 450ms ---
    if (elapsed >= 450 && elapsed <= 1400) {
      const burstAge = elapsed - 450;
      const centerX = W * 0.5;
      const centerY = H * 0.5;

      // Spawn once
      if (burstAge < 35) {
        for (let i = 0; i < 60; i++) {
          const ang = Math.random() * Math.PI * 2;
          const spd = 4 + Math.random() * 14;
          this.particles.push({
            x: centerX,
            y: centerY,
            vx: Math.cos(ang) * spd,
            vy: Math.sin(ang) * spd,
            size: 4 + Math.random() * 7,
            color: [255, Math.floor(80 + Math.random() * 175), 0],
            alpha: 1.0,
            decay: 0.016 + Math.random() * 0.016
          });
        }
        this.shockwaves.push({ x: centerX, y: centerY, r: 10, maxR: Math.max(W, H) * 0.6, alpha: 1.0, color: '#ff4d00' });
        this.shockwaves.push({ x: centerX, y: centerY, r: 10, maxR: Math.max(W, H) * 0.45, alpha: 1.0, color: '#ffb703' });
      }

      // Golden Screen Flash
      if (burstAge < 250) {
        const flashAlpha = (1 - burstAge / 250.0) * 0.35;
        this.ctx.fillStyle = `rgba(255, 120, 0, ${flashAlpha})`;
        this.ctx.fillRect(0, 0, W, H);
      }

      // Render Japanese Title Banner
      this.renderAnimeBanner(
        'ヒノカミ神楽・碧羅の天',
        'HINOKAMI KAGURA // SOLAR CROSS-SLASH',
        '#ff3b00',
        '#ffb703',
        burstAge
      );
    }

    this.renderShockwaves();
    this.renderParticles();
  }

  // =========================================================================
  // BLUE LOCK CUTSCENE: ISAGI DIRECT SHOT DUAL VOLLEY
  // 1. Kick 1: Left-Bottom corner -> Right-Up corner
  // 2. Kick 2: Right-Bottom corner -> Left-Up corner
  // =========================================================================
  renderBlueLockCutscene(elapsed) {
    const W = this.width;
    const H = this.height;

    // --- Kick 1 (Left-Bottom -> Right-Up) from t = 0 to 600ms ---
    const t1 = elapsed / 580.0;
    if (t1 >= 0 && t1 <= 1.3) {
      const progress = Math.min(Math.max(t1, 0), 1);
      const ease = Math.pow(progress, 2.5); // accelerating rocket kick

      const startX = 60;
      const startY = H - 80;
      const endX = W + 120;
      const endY = -100;

      const curX = startX + (endX - startX) * ease;
      const curY = startY + (endY - startY) * ease;

      // Draw Isagi Striker at bottom-left corner
      if (this.images.isagi && elapsed < 850) {
        const isagiAlpha = Math.max(0, 1 - Math.max(0, elapsed - 550) / 300);
        this.ctx.save();
        this.ctx.globalAlpha = isagiAlpha;
        this.ctx.translate(10, H - 280);
        this.ctx.shadowColor = 'rgba(0, 240, 255, 0.9)';
        this.ctx.shadowBlur = 40;
        const sprW = 240;
        const sprH = 212;
        this.ctx.drawImage(this.images.isagi, 0, 0, sprW, sprH);
        this.ctx.restore();
      }

      // Ball Trail
      if (progress < 1) {
        this.slashTrails.push({
          x: curX,
          y: curY,
          type: 'ego',
          color: [0, 240, 255],
          size: 40 + Math.random() * 20,
          alpha: 1.0,
          created: elapsed
        });

        // Spawn puzzle fragments
        for (let i = 0; i < 3; i++) {
          this.puzzleShards.push({
            x: curX,
            y: curY,
            vx: (Math.random() - 0.5) * 8 - 4,
            vy: (Math.random() - 0.5) * 8 + 4,
            size: 8 + Math.random() * 12,
            rot: Math.random() * Math.PI * 2,
            rotSpeed: (Math.random() - 0.5) * 0.2,
            alpha: 1.0
          });
        }
      }

      // Draw Spinning Blue Lock Ball
      if (this.images.ball && progress < 1.05) {
        this.ctx.save();
        this.ctx.translate(curX, curY);
        this.ctx.rotate(elapsed * 0.04);
        this.ctx.shadowColor = 'rgba(0, 255, 136, 0.95)';
        this.ctx.shadowBlur = 30;
        const ballSize = 85;
        this.ctx.drawImage(this.images.ball, -ballSize * 0.5, -ballSize * 0.5, ballSize, ballSize);
        this.ctx.restore();
      }
    }

    // --- Kick 2 (Right-Bottom -> Left-Up) from t = 280ms to 880ms ---
    const t2 = (elapsed - 280) / 580.0;
    if (t2 >= 0 && t2 <= 1.3) {
      const progress = Math.min(Math.max(t2, 0), 1);
      const ease = Math.pow(progress, 2.5);

      const startX = W - 60;
      const startY = H - 80;
      const endX = -120;
      const endY = -100;

      const curX = startX + (endX - startX) * ease;
      const curY = startY + (endY - startY) * ease;

      // Draw Isagi Striker at bottom-right corner (flipped)
      if (this.images.isagi && elapsed > 280 && elapsed < 1050) {
        const isagiAlpha = Math.max(0, 1 - Math.max(0, elapsed - 780) / 270);
        this.ctx.save();
        this.ctx.globalAlpha = isagiAlpha;
        this.ctx.translate(W - 10, H - 280);
        this.ctx.scale(-1, 1);
        this.ctx.shadowColor = 'rgba(0, 255, 136, 0.9)';
        this.ctx.shadowBlur = 40;
        const sprW = 240;
        const sprH = 212;
        this.ctx.drawImage(this.images.isagi, 0, 0, sprW, sprH);
        this.ctx.restore();
      }

      if (progress < 1) {
        this.slashTrails.push({
          x: curX,
          y: curY,
          type: 'ego_green',
          color: [0, 255, 136],
          size: 40 + Math.random() * 20,
          alpha: 1.0,
          created: elapsed
        });

        for (let i = 0; i < 3; i++) {
          this.puzzleShards.push({
            x: curX,
            y: curY,
            vx: (Math.random() - 0.5) * 8 + 4,
            vy: (Math.random() - 0.5) * 8 + 4,
            size: 8 + Math.random() * 12,
            rot: Math.random() * Math.PI * 2,
            rotSpeed: (Math.random() - 0.5) * 0.2,
            alpha: 1.0
          });
        }
      }

      if (this.images.ball && progress < 1.05) {
        this.ctx.save();
        this.ctx.translate(curX, curY);
        this.ctx.rotate(-elapsed * 0.04);
        this.ctx.shadowColor = 'rgba(0, 240, 255, 0.95)';
        this.ctx.shadowBlur = 30;
        const ballSize = 85;
        this.ctx.drawImage(this.images.ball, -ballSize * 0.5, -ballSize * 0.5, ballSize, ballSize);
        this.ctx.restore();
      }
    }

    this.renderSlashTrails();

    // --- Direct Shot Cross-Fire Impact at t = 450ms ---
    if (elapsed >= 450 && elapsed <= 1400) {
      const burstAge = elapsed - 450;
      const centerX = W * 0.5;
      const centerY = H * 0.5;

      if (burstAge < 35) {
        for (let i = 0; i < 50; i++) {
          const ang = Math.random() * Math.PI * 2;
          const spd = 4 + Math.random() * 15;
          this.particles.push({
            x: centerX,
            y: centerY,
            vx: Math.cos(ang) * spd,
            vy: Math.sin(ang) * spd,
            size: 4 + Math.random() * 6,
            color: [0, Math.floor(210 + Math.random() * 45), 255],
            alpha: 1.0,
            decay: 0.018 + Math.random() * 0.015
          });
        }
        for (let i = 0; i < 25; i++) {
          const ang = Math.random() * Math.PI * 2;
          const spd = 3 + Math.random() * 10;
          this.puzzleShards.push({
            x: centerX,
            y: centerY,
            vx: Math.cos(ang) * spd,
            vy: Math.sin(ang) * spd,
            size: 10 + Math.random() * 16,
            rot: Math.random() * Math.PI * 2,
            rotSpeed: (Math.random() - 0.5) * 0.25,
            alpha: 1.0
          });
        }
        this.shockwaves.push({ x: centerX, y: centerY, r: 10, maxR: Math.max(W, H) * 0.55, alpha: 1.0, color: '#00f0ff' });
        this.shockwaves.push({ x: centerX, y: centerY, r: 10, maxR: Math.max(W, H) * 0.4, alpha: 1.0, color: '#00ff88' });
      }

      // Cyan Metavision Flash
      if (burstAge < 250) {
        const flashAlpha = (1 - burstAge / 250.0) * 0.35;
        this.ctx.fillStyle = `rgba(0, 240, 255, ${flashAlpha})`;
        this.ctx.fillRect(0, 0, W, H);
      }

      this.renderAnimeBanner(
        '直撃蹴弾・最前線のエゴ',
        'METAVISION // DIRECT SHOT CROSS-FIRE',
        '#00f0ff',
        '#00ff88',
        burstAge
      );
    }

    this.renderShockwaves();
    this.renderPuzzleShards();
    this.renderParticles();
  }

  // =========================================================================
  // HELPER RENDERING METHODS
  // =========================================================================
  renderSlashTrails() {
    this.ctx.save();
    for (let i = this.slashTrails.length - 1; i >= 0; i--) {
      const st = this.slashTrails[i];
      st.alpha -= 0.035;
      if (st.alpha <= 0) {
        this.slashTrails.splice(i, 1);
        continue;
      }
      this.ctx.beginPath();
      this.ctx.arc(st.x, st.y, st.size * st.alpha, 0, Math.PI * 2);
      this.ctx.fillStyle = `rgba(${st.color[0]}, ${st.color[1]}, ${st.color[2]}, ${st.alpha * 0.7})`;
      this.ctx.shadowColor = `rgb(${st.color[0]}, ${st.color[1]}, ${st.color[2]})`;
      this.ctx.shadowBlur = 20;
      this.ctx.fill();
    }
    this.ctx.restore();
  }

  renderParticles() {
    this.ctx.save();
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.alpha -= p.decay;
      if (p.alpha <= 0) {
        this.particles.splice(i, 1);
        continue;
      }
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.size * p.alpha, 0, Math.PI * 2);
      this.ctx.fillStyle = `rgba(${p.color[0]}, ${p.color[1]}, ${p.color[2]}, ${p.alpha})`;
      this.ctx.fill();
    }
    this.ctx.restore();
  }

  renderShockwaves() {
    this.ctx.save();
    for (let i = this.shockwaves.length - 1; i >= 0; i--) {
      const sw = this.shockwaves[i];
      sw.r += (sw.maxR - sw.r) * 0.12;
      sw.alpha -= 0.045;
      if (sw.alpha <= 0) {
        this.shockwaves.splice(i, 1);
        continue;
      }
      this.ctx.beginPath();
      this.ctx.arc(sw.x, sw.y, sw.r, 0, Math.PI * 2);
      this.ctx.strokeStyle = sw.color;
      this.ctx.lineWidth = 4 * sw.alpha;
      this.ctx.shadowColor = sw.color;
      this.ctx.shadowBlur = 15;
      this.ctx.globalAlpha = sw.alpha;
      this.ctx.stroke();
    }
    this.ctx.restore();
  }

  renderPuzzleShards() {
    this.ctx.save();
    for (let i = this.puzzleShards.length - 1; i >= 0; i--) {
      const ps = this.puzzleShards[i];
      ps.x += ps.vx;
      ps.y += ps.vy;
      ps.rot += ps.rotSpeed;
      ps.alpha -= 0.025;
      if (ps.alpha <= 0) {
        this.puzzleShards.splice(i, 1);
        continue;
      }
      this.ctx.save();
      this.ctx.translate(ps.x, ps.y);
      this.ctx.rotate(ps.rot);
      this.ctx.globalAlpha = ps.alpha;
      this.ctx.strokeStyle = '#00f0ff';
      this.ctx.lineWidth = 2;
      this.ctx.fillStyle = 'rgba(0, 255, 136, 0.4)';
      const s = ps.size;
      this.ctx.strokeRect(-s * 0.5, -s * 0.5, s, s);
      this.ctx.fillRect(-s * 0.5, -s * 0.5, s, s);
      this.ctx.restore();
    }
    this.ctx.restore();
  }

  renderAnimeBanner(kanji, sub, color1, color2, age) {
    if (age > 900) return;
    const progress = Math.min(age / 900.0, 1);
    const alpha = progress < 0.2 ? progress / 0.2 : 1 - (progress - 0.7) / 0.3;
    if (alpha <= 0) return;

    this.ctx.save();
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    this.ctx.globalAlpha = Math.max(0, Math.min(alpha, 1));

    const cx = this.width * 0.5;
    const cy = this.height * 0.5;

    // Kanji Title
    this.ctx.font = '900 clamp(24px, 5vw, 54px) "Noto Serif JP", "Cinzel", serif';
    this.ctx.shadowColor = color1;
    this.ctx.shadowBlur = 25;
    this.ctx.fillStyle = '#ffffff';
    this.ctx.fillText(kanji, cx, cy - 20);

    // English Subtitle
    this.ctx.font = '800 clamp(12px, 2vw, 18px) "Orbitron", sans-serif';
    this.ctx.shadowColor = color2;
    this.ctx.shadowBlur = 15;
    this.ctx.fillStyle = color2;
    this.ctx.fillText(sub, cx, cy + 30);

    this.ctx.restore();
  }
}

// Global initialization
window.animeCutscene = new AnimeCutsceneEngine();
