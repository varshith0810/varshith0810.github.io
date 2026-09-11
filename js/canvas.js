/**
 * Canvas Engine: Dual-Mode Interactive Visual System
 * - Mode 'bluelock': Metavision spatial graph, floating neon puzzle pieces, ego flow aura
 * - Mode 'demonslayer': Nichirin blade slash ribbon, Sun breathing embers, Water breathing trails
 */

class AnimeCanvasEngine {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.currentTheme = document.body.dataset.theme || 'bluelock';

    this.width = 0;
    this.height = 0;
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);

    this.pointer = {
      x: window.innerWidth * 0.5,
      y: window.innerHeight * 0.4,
      targetX: window.innerWidth * 0.5,
      targetY: window.innerHeight * 0.4,
      prevX: window.innerWidth * 0.5,
      prevY: window.innerHeight * 0.4,
      speed: 0,
      isDown: false,
      active: false
    };

    // Slash points buffer for katana ribbon
    this.slashPoints = [];
    this.maxSlashPoints = 25;

    // Blue Lock puzzle pieces & nodes
    this.puzzlePieces = [];
    this.networkNodes = [];

    // Demon Slayer particles (embers + water droplets)
    this.slayerParticles = [];

    // Burst particles for click / awakening
    this.burstParticles = [];

    this.animationFrameId = null;
    this.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    this.init();
  }

  init() {
    this.resize();
    window.addEventListener('resize', () => this.resize(), { passive: true });

    window.addEventListener('pointermove', (e) => {
      this.pointer.active = true;
      this.pointer.targetX = e.clientX;
      this.pointer.targetY = e.clientY;

      const dx = e.clientX - this.pointer.prevX;
      const dy = e.clientY - this.pointer.prevY;
      this.pointer.speed = Math.sqrt(dx * dx + dy * dy);
      this.pointer.prevX = e.clientX;
      this.pointer.prevY = e.clientY;

      if (this.currentTheme === 'demonslayer') {
        this.addSlashPoint(e.clientX, e.clientY);
        if (this.pointer.speed > 15) {
          this.spawnSlashSparks(e.clientX, e.clientY, 3);
        }
      }
    }, { passive: true });

    window.addEventListener('pointerdown', (e) => {
      this.pointer.isDown = true;
      this.triggerBurst(e.clientX, e.clientY);
      if (this.currentTheme === 'demonslayer') {
        if (window.animeAudio) window.animeAudio.playKatanaSlash();
      } else {
        if (window.animeAudio) window.animeAudio.playMetavisionHum();
      }
    });

    window.addEventListener('pointerup', () => {
      this.pointer.isDown = false;
    });

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        cancelAnimationFrame(this.animationFrameId);
      } else {
        this.loop();
      }
    });

    this.setupParticles();
    this.loop();
  }

  setTheme(theme) {
    this.currentTheme = theme;
    this.slashPoints = [];
    this.burstParticles = [];
    this.setupParticles();
  }

  resize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = this.width * this.dpr;
    this.canvas.height = this.height * this.dpr;
    this.canvas.style.width = `${this.width}px`;
    this.canvas.style.height = `${this.height}px`;
    this.ctx.scale(this.dpr, this.dpr);
  }

  setupParticles() {
    if (this.currentTheme === 'bluelock') {
      // Puzzle pieces
      const pieceCount = Math.min(Math.floor(this.width / 55), 24);
      this.puzzlePieces = [];
      for (let i = 0; i < pieceCount; i++) {
        this.puzzlePieces.push({
          x: Math.random() * this.width,
          y: Math.random() * this.height,
          size: 22 + Math.random() * 26,
          vx: (Math.random() - 0.5) * 0.7,
          vy: (Math.random() - 0.5) * 0.7,
          angle: Math.random() * Math.PI * 2,
          vAngle: (Math.random() - 0.5) * 0.018,
          alpha: 0.15 + Math.random() * 0.35,
          color: Math.random() > 0.4 ? '#00f0ff' : (Math.random() > 0.5 ? '#7928ca' : '#00ff88'),
          type: Math.floor(Math.random() * 3)
        });
      }

      // Metavision network nodes
      const nodeCount = Math.min(Math.floor(this.width / 35), 45);
      this.networkNodes = [];
      for (let i = 0; i < nodeCount; i++) {
        this.networkNodes.push({
          x: Math.random() * this.width,
          y: Math.random() * this.height,
          vx: (Math.random() - 0.5) * 0.6,
          vy: (Math.random() - 0.5) * 0.6,
          radius: 1.5 + Math.random() * 2.5,
          color: Math.random() > 0.3 ? '#00f0ff' : '#a855f7'
        });
      }
    } else {
      // Demon Slayer: Hinokami Flame embers & Water breathing droplets
      const count = Math.min(Math.floor(this.width / 30), 65);
      this.slayerParticles = [];
      for (let i = 0; i < count; i++) {
        const isFlame = Math.random() > 0.45;
        this.slayerParticles.push({
          x: Math.random() * this.width,
          y: Math.random() * this.height,
          vx: (Math.random() - 0.5) * 0.8,
          vy: isFlame ? -(0.8 + Math.random() * 1.5) : (0.4 + Math.random() * 0.8),
          size: isFlame ? (2 + Math.random() * 3.5) : (1.5 + Math.random() * 3),
          life: Math.random() * 100,
          maxLife: 60 + Math.random() * 80,
          alpha: 0.2 + Math.random() * 0.6,
          isFlame: isFlame,
          color: isFlame
            ? (Math.random() > 0.5 ? '#ff4500' : '#ff9a00')
            : (Math.random() > 0.5 ? '#00b4d8' : '#e0f2fe')
        });
      }
    }
  }

  addSlashPoint(x, y) {
    this.slashPoints.push({
      x,
      y,
      age: 0,
      maxAge: 16
    });
    if (this.slashPoints.length > this.maxSlashPoints) {
      this.slashPoints.shift();
    }
  }

  spawnSlashSparks(x, y, count = 4) {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 2 + Math.random() * 5;
      this.burstParticles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        radius: 1.5 + Math.random() * 2,
        life: 1,
        decay: 0.04 + Math.random() * 0.04,
        color: Math.random() > 0.4 ? '#ff6a00' : '#ffdd00'
      });
    }
  }

  triggerBurst(x, y) {
    const isSlayer = this.currentTheme === 'demonslayer';
    const count = 28;
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 / count) * i + (Math.random() * 0.3);
      const speed = 3 + Math.random() * 7;
      let color;
      if (isSlayer) {
        color = Math.random() > 0.5 ? '#ff3b00' : (Math.random() > 0.5 ? '#ff9500' : '#00b4d8');
      } else {
        color = Math.random() > 0.5 ? '#00f0ff' : (Math.random() > 0.5 ? '#7928ca' : '#00ff88');
      }

      this.burstParticles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        radius: 2 + Math.random() * 3.5,
        life: 1,
        decay: 0.02 + Math.random() * 0.025,
        color: color,
        isPuzzleShard: !isSlayer && Math.random() > 0.4
      });
    }
  }

  // Draw a Blue Lock stylized puzzle shard
  drawPuzzlePiece(ctx, x, y, size, angle, color, alpha) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = 1.5;
    ctx.globalAlpha = alpha;

    const s = size * 0.5;
    const tab = s * 0.35;

    ctx.beginPath();
    ctx.moveTo(-s, -s);
    // Top edge with notch/tab
    ctx.lineTo(-tab, -s);
    ctx.arc(0, -s - tab * 0.6, tab * 0.7, Math.PI * 0.8, Math.PI * 0.2, false);
    ctx.lineTo(s, -s);

    // Right edge
    ctx.lineTo(s, -tab);
    ctx.arc(s + tab * 0.6, 0, tab * 0.7, -Math.PI * 0.3, Math.PI * 0.3, false);
    ctx.lineTo(s, s);

    // Bottom edge
    ctx.lineTo(tab, s);
    ctx.arc(0, s - tab * 0.6, tab * 0.7, Math.PI * 0.2, Math.PI * 0.8, true);
    ctx.lineTo(-s, s);

    // Left edge
    ctx.lineTo(-s, tab);
    ctx.arc(-s - tab * 0.6, 0, tab * 0.7, Math.PI * 0.3, -Math.PI * 0.3, true);
    ctx.closePath();

    ctx.stroke();
    ctx.globalAlpha = alpha * 0.18;
    ctx.fill();
    ctx.restore();
  }

  updateAndRender() {
    this.ctx.clearRect(0, 0, this.width, this.height);

    // Smooth pointer interpolation
    this.pointer.x += (this.pointer.targetX - this.pointer.x) * 0.12;
    this.pointer.y += (this.pointer.targetY - this.pointer.y) * 0.12;

    if (this.currentTheme === 'bluelock') {
      this.renderBlueLock();
    } else {
      this.renderDemonSlayer();
    }

    // Render universal burst particles
    this.renderBurstParticles();
  }

  renderBlueLock() {
    const ctx = this.ctx;

    // Metavision Spatial Network lines
    const nodes = this.networkNodes;
    for (let i = 0; i < nodes.length; i++) {
      const n1 = nodes[i];
      n1.x += n1.vx;
      n1.y += n1.vy;

      if (n1.x < 0 || n1.x > this.width) n1.vx *= -1;
      if (n1.y < 0 || n1.y > this.height) n1.vy *= -1;

      // Mouse influence
      const dxm = this.pointer.x - n1.x;
      const dym = this.pointer.y - n1.y;
      const distMouse = Math.sqrt(dxm * dxm + dym * dym);
      if (distMouse < 180 && this.pointer.active) {
        ctx.strokeStyle = '#00f0ff';
        ctx.globalAlpha = (1 - distMouse / 180) * 0.45;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(n1.x, n1.y);
        ctx.lineTo(this.pointer.x, this.pointer.y);
        ctx.stroke();
      }

      // Inter-node connections
      for (let j = i + 1; j < nodes.length; j++) {
        const n2 = nodes[j];
        const dx = n2.x - n1.x;
        const dy = n2.y - n1.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 110) {
          ctx.strokeStyle = n1.color;
          ctx.globalAlpha = (1 - dist / 110) * 0.22;
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          ctx.moveTo(n1.x, n1.y);
          ctx.lineTo(n2.x, n2.y);
          ctx.stroke();
        }
      }

      // Draw node point
      ctx.fillStyle = n1.color;
      ctx.globalAlpha = 0.65;
      ctx.beginPath();
      ctx.arc(n1.x, n1.y, n1.radius, 0, Math.PI * 2);
      ctx.fill();
    }

    // Floating puzzle pieces
    for (let i = 0; i < this.puzzlePieces.length; i++) {
      const p = this.puzzlePieces[i];
      p.x += p.vx;
      p.y += p.vy;
      p.angle += p.vAngle;

      if (p.x < -40) p.x = this.width + 40;
      if (p.x > this.width + 40) p.x = -40;
      if (p.y < -40) p.y = this.height + 40;
      if (p.y > this.height + 40) p.y = -40;

      // Mouse magnet repulsion / slight drift
      const dx = this.pointer.x - p.x;
      const dy = this.pointer.y - p.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 160 && this.pointer.active) {
        const force = (1 - dist / 160) * 2.5;
        p.x -= (dx / dist) * force;
        p.y -= (dy / dist) * force;
      }

      this.drawPuzzlePiece(ctx, p.x, p.y, p.size, p.angle, p.color, p.alpha);
    }

    // Metavision Tactical Eye / Target Reticle at cursor
    if (this.pointer.active) {
      ctx.save();
      ctx.translate(this.pointer.x, this.pointer.y);

      // Outer targeting diamond
      ctx.strokeStyle = '#00f0ff';
      ctx.globalAlpha = 0.35;
      ctx.lineWidth = 1.2;
      const r = 24;
      ctx.beginPath();
      ctx.moveTo(0, -r);
      ctx.lineTo(r, 0);
      ctx.lineTo(0, r);
      ctx.lineTo(-r, 0);
      ctx.closePath();
      ctx.stroke();

      // Inner pulse dot
      ctx.fillStyle = '#00ff88';
      ctx.globalAlpha = 0.6;
      ctx.beginPath();
      ctx.arc(0, 0, 2.5, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    }
  }

  renderDemonSlayer() {
    const ctx = this.ctx;

    // Floating Embers (Sun Breathing) & Droplets (Water Breathing)
    for (let i = 0; i < this.slayerParticles.length; i++) {
      const p = this.slayerParticles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.life++;

      if (p.life > p.maxLife || p.y < -10 || p.y > this.height + 10) {
        p.life = 0;
        p.x = Math.random() * this.width;
        p.y = p.isFlame ? this.height + 10 : -10;
      }

      const progress = p.life / p.maxLife;
      const currentAlpha = p.alpha * (1 - Math.abs(progress - 0.5) * 2);

      ctx.save();
      ctx.fillStyle = p.color;
      ctx.globalAlpha = Math.max(0, currentAlpha);
      ctx.shadowColor = p.color;
      ctx.shadowBlur = p.isFlame ? 10 : 6;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // Katana Blade Slash Ribbon
    if (this.slashPoints.length > 2) {
      for (let i = 0; i < this.slashPoints.length; i++) {
        this.slashPoints[i].age++;
      }
      this.slashPoints = this.slashPoints.filter(p => p.age < p.maxAge);

      if (this.slashPoints.length > 2) {
        ctx.save();
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        // Outer fiery/azure blade aura
        for (let i = 1; i < this.slashPoints.length; i++) {
          const p1 = this.slashPoints[i - 1];
          const p2 = this.slashPoints[i];
          const progress = i / this.slashPoints.length;
          const alpha = progress * (1 - p2.age / p2.maxAge);

          ctx.strokeStyle = '#ff4500';
          ctx.shadowColor = '#ff9500';
          ctx.shadowBlur = 12;
          ctx.lineWidth = progress * 9;
          ctx.globalAlpha = alpha * 0.8;

          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
        }

        // Inner sharp white-hot blade cutting edge
        for (let i = 1; i < this.slashPoints.length; i++) {
          const p1 = this.slashPoints[i - 1];
          const p2 = this.slashPoints[i];
          const progress = i / this.slashPoints.length;
          const alpha = progress * (1 - p2.age / p2.maxAge);

          ctx.strokeStyle = '#ffffff';
          ctx.shadowColor = '#ffffff';
          ctx.shadowBlur = 6;
          ctx.lineWidth = progress * 2.5;
          ctx.globalAlpha = alpha * 0.95;

          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
        }

        ctx.restore();
      }
    }
  }

  renderBurstParticles() {
    if (this.burstParticles.length === 0) return;
    const ctx = this.ctx;

    for (let i = this.burstParticles.length - 1; i >= 0; i--) {
      const p = this.burstParticles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vx *= 0.95;
      p.vy *= 0.95;
      p.life -= p.decay;

      if (p.life <= 0) {
        this.burstParticles.splice(i, 1);
        continue;
      }

      ctx.save();
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.life;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 8;

      if (p.isPuzzleShard) {
        ctx.translate(p.x, p.y);
        ctx.fillRect(-p.radius, -p.radius, p.radius * 2, p.radius * 2);
      } else {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius * p.life, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }
  }

  loop() {
    this.updateAndRender();
    this.animationFrameId = requestAnimationFrame(() => this.loop());
  }
}

window.AnimeCanvasEngine = AnimeCanvasEngine;
