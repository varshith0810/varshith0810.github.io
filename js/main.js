/**
 * Main Application Controller
 * Manages:
 * - Domain Shift Theme Engine (Blue Lock vs Demon Slayer)
 * - Audio SFX integrations
 * - Typewriter text rotator
 * - Interactive Skills filtering
 * - Terminal interactive CLI
 * - Navigation and copy interactions
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Canvas & Tilt
  const canvasEngine = new AnimeCanvasEngine('bg-canvas');
  const tiltController = new TiltController('[data-tilt]');

  // 2. Audio Toggle Setup
  const audioToggle = document.getElementById('audioToggle');
  const soundIcon = document.getElementById('soundIcon');

  const updateAudioUI = () => {
    const isMuted = window.animeAudio.isMuted;
    if (isMuted) {
      soundIcon.innerHTML = `
        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
        <line x1="23" y1="9" x2="17" y2="15"></line>
        <line x1="17" y1="9" x2="23" y2="15"></line>
      `;
      audioToggle.title = 'Sound FX: Muted';
      audioToggle.style.opacity = '0.5';
    } else {
      soundIcon.innerHTML = `
        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
        <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
      `;
      audioToggle.title = 'Sound FX: Active';
      audioToggle.style.opacity = '1';
    }
  };
  updateAudioUI();

  audioToggle.addEventListener('click', () => {
    window.animeAudio.toggleMute();
    updateAudioUI();
  });

  // 3. Theme / Domain Shift Engine
  const themeToggle = document.getElementById('themeToggle');
  const themeLabel = document.getElementById('themeLabel');
  const heroBadgeText = document.getElementById('heroBadgeText');
  const kanjiWatermark = document.getElementById('kanjiWatermark');
  const hudRankTop = document.getElementById('hudRankTop');
  const avatarTagline = document.getElementById('avatarTagline');
  const statusTag = document.getElementById('statusTag');
  const skillsTag = document.getElementById('skillsTag');
  const projectsTag = document.getElementById('projectsTag');
  const journeyTag = document.getElementById('journeyTag');
  const contactTag = document.getElementById('contactTag');
  const awakenBtn = document.getElementById('awakenBtn');
  const footerQuote = document.getElementById('footerQuote');

  const savedTheme = localStorage.getItem('portfolio_theme') || 'bluelock';
  applyTheme(savedTheme, false);

  function applyTheme(theme, playSound = true) {
    document.body.dataset.theme = theme;
    localStorage.setItem('portfolio_theme', theme);
    if (canvasEngine) canvasEngine.setTheme(theme);

    if (theme === 'bluelock') {
      themeLabel.textContent = 'EGO MODE (BLUE LOCK)';
      heroBadgeText.textContent = 'METAVISION ACTIVE • PLAYER #1';
      kanjiWatermark.textContent = '世界一のエゴイスト';
      hudRankTop.textContent = 'RANK S // EGOIST';
      avatarTagline.textContent = '覚醒・FLOW STATE';
      statusTag.textContent = 'METAVISION SCAN REPORT';
      skillsTag.textContent = 'BREATHING TECHNIQUES & WEAPONS';
      projectsTag.textContent = 'OFFICIAL MATCHES & COMBAT ARCHIVE';
      journeyTag.textContent = 'SELECTION PHASES & AWAKENING';
      contactTag.textContent = 'DIRECT CONNECTION PROTOCOL';
      awakenBtn.innerHTML = '<span>⚡ AWAKEN EGO</span>';
      footerQuote.textContent = '「 世界一のエゴイストでなければ、世界一のストライカーにはなれない 」';
    } else {
      themeLabel.textContent = 'BREATHING MODE (DEMON SLAYER)';
      heroBadgeText.textContent = 'TOTAL CONCENTRATION • HASHIRA';
      kanjiWatermark.textContent = '全集中・常中';
      hudRankTop.textContent = 'HASHIRA // SUN BREATHING';
      avatarTagline.textContent = '心を燃やせ・SET HEART ABLAZE';
      statusTag.textContent = 'HASHIRA COMBAT ASSESSMENT';
      skillsTag.textContent = 'BREATHING FORMS & NICHIRIN BLADES';
      projectsTag.textContent = 'DEMON SLAYING EXPEDITIONS';
      journeyTag.textContent = 'FINAL SELECTION TO PILLAR';
      contactTag.textContent = 'KASUGAI CROW DISPATCH';
      awakenBtn.innerHTML = '<span>🔥 HINOKAMI KAGURA</span>';
      footerQuote.textContent = '「 胸を張って生きろ。己の弱さや不甲斐なさにどれだけ打ちのめされようと、心を燃やせ 」';
    }

    if (playSound && window.animeAudio) {
      window.animeAudio.playDomainShift(theme);
    }
  }

  themeToggle.addEventListener('click', () => {
    const current = document.body.dataset.theme || 'bluelock';
    const next = current === 'bluelock' ? 'demonslayer' : 'bluelock';
    applyTheme(next, true);
  });

  // 4. Awakening Special Power Burst
  awakenBtn.addEventListener('click', (e) => {
    if (window.animeAudio) window.animeAudio.playAwakeningBurst();

    // Trigger sequential explosions across viewport
    const w = window.innerWidth;
    const h = window.innerHeight;
    for (let i = 0; i < 5; i++) {
      setTimeout(() => {
        const x = Math.random() * (w * 0.8) + (w * 0.1);
        const y = Math.random() * (h * 0.8) + (h * 0.1);
        if (canvasEngine) canvasEngine.triggerBurst(x, y);
      }, i * 90);
    }
  });

  // 5. Dynamic Typewriter Effect
  const typewriterElement = document.getElementById('typewriter');
  const roles = [
    'AI/ML Engineer & SDE',
    'Deep Learning Researcher',
    'Distributed Systems Architect',
    'High-Performance Systems Engineer',
    "World's #1 Egoist Developer"
  ];
  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingDelay = 100;

  function typeRole() {
    const currentRole = roles[roleIndex];
    if (isDeleting) {
      typewriterElement.textContent = currentRole.substring(0, charIndex - 1);
      charIndex--;
      typingDelay = 40;
    } else {
      typewriterElement.textContent = currentRole.substring(0, charIndex + 1);
      charIndex++;
      typingDelay = 90;
    }

    if (!isDeleting && charIndex === currentRole.length) {
      typingDelay = 1800; // Pause at end of text
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      typingDelay = 300;
    }

    setTimeout(typeRole, typingDelay);
  }
  typeRole();

  // 6. Skills Category Filter
  const skillTabs = document.querySelectorAll('.skill-tab-btn');
  const skillCards = document.querySelectorAll('.skill-card');

  skillTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      skillTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const filter = tab.dataset.filter;
      skillCards.forEach((card) => {
        const category = card.dataset.category;
        if (filter === 'all' || category === filter) {
          card.style.display = 'flex';
          card.style.opacity = '1';
        } else {
          card.style.display = 'none';
          card.style.opacity = '0';
        }
      });

      if (window.animeAudio) window.animeAudio.playPuzzleClick();
    });
  });

  // 7. Interactive CLI Terminal
  const terminalInput = document.getElementById('terminalInput');
  const terminalBody = document.getElementById('terminalBody');
  const commandHistory = [];
  let historyIndex = -1;

  const terminalCommands = {
    help: () => `
<div class="term-cyan">=== AVAILABLE DIRECTIVES ===</div>
- <strong class="term-green">about</strong>: Profile overview & credentials
- <strong class="term-green">skills</strong>: Inspect technical weapons & breathing forms
- <strong class="term-green">projects</strong>: Review operational domains & codebases
- <strong class="term-green">contact</strong>: Communication links & email transmission
- <strong class="term-green">hire</strong>: Mission readiness & availability status
- <strong class="term-green">theme</strong>: Toggle between Blue Lock and Demon Slayer modes
- <strong class="term-green">awaken</strong>: Unleash maximum chemical reaction / Hinokami burst
- <strong class="term-green">clear</strong>: Wipe terminal logs
    `,
    about: () => `
<div class="term-cyan">[EVALUATION RECORD]</div>
<strong>Name:</strong> Varshith Reddy<br>
<strong>Specialization:</strong> AI/ML Engineering & Distributed Software Systems<br>
<strong>Philosophy:</strong> Combining data-driven analytical foresight (Metavision) with relentless execution discipline (Total Concentration).<br>
<strong>Mission:</strong> Building resilient, high-throughput intelligence engines for global challenges.
    `,
    skills: () => `
<div class="term-cyan">[ARSENAL ARCHIVE]</div>
- <strong class="term-purple">AI / ML:</strong> PyTorch, TensorFlow, Hugging Face, LLMs, LangChain, OpenCV, MLOps<br>
- <strong class="term-purple">Backend:</strong> Python, FastAPI, Go, Node.js, PostgreSQL, Redis, Docker, GCP<br>
- <strong class="term-purple">Systems & DSA:</strong> Dynamic Programming, Trees, Graphs, Low-latency design
    `,
    projects: () => `
<div class="term-cyan">[MISSION LOGS]</div>
1. <strong class="term-green">Metavision Multimodal AI</strong>: Real-time visual reasoning agent.<br>
2. <strong class="term-green">Hinokami Inference Engine</strong>: High-throughput distributed model server in Go & Python.<br>
3. <strong class="term-green">Egoist Arena</strong>: Multi-agent reinforcement learning simulation sandbox.<br>
4. <strong class="term-green">Neural Acoustic Classifier</strong>: Edge audio stream classifier with Web Audio API.
    `,
    contact: () => `
<div class="term-cyan">[COMMUNICATION CHANNELS]</div>
- <strong>Email:</strong> <a href="mailto:bomminenivarshith@gmail.com" class="term-green" style="text-decoration: underline;">bomminenivarshith@gmail.com</a><br>
- <strong>GitHub:</strong> <a href="https://github.com/varshith0810" target="_blank" class="term-green" style="text-decoration: underline;">github.com/varshith0810</a><br>
- <strong>Location:</strong> Ready to deploy worldwide (Remote / On-site)
    `,
    hire: () => `
<div class="term-green">[STATUS: HIGHLY ACTIVE & AVAILABLE]</div>
Seeking full-time roles, elite research challenges, and high-impact engineering opportunities.
Transmitting immediate response to all recruiter and engineering leads!
    `,
    theme: () => {
      themeToggle.click();
      return `<div class="term-cyan">[DOMAIN SHIFT EXECUTED]</div> Current mode: ${document.body.dataset.theme}`;
    },
    awaken: () => {
      awakenBtn.click();
      return `<div class="term-green">[BURST TRIGGERED] Flow state peak unlocked!</div>`;
    },
    clear: () => {
      terminalBody.innerHTML = '';
      return '';
    }
  };

  if (terminalInput) {
    terminalInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const rawCmd = terminalInput.value.trim();
        if (!rawCmd) return;

        commandHistory.push(rawCmd);
        historyIndex = commandHistory.length;

        const cmd = rawCmd.toLowerCase();
        terminalInput.value = '';

        // Append user prompt log
        const logLine = document.createElement('div');
        logLine.className = 'terminal-log';
        logLine.innerHTML = `<span class="term-prompt">varshith&gt;</span> ${rawCmd}`;
        terminalBody.appendChild(logLine);

        // Process command
        const responseLine = document.createElement('div');
        responseLine.className = 'terminal-log';

        if (terminalCommands[cmd]) {
          const res = terminalCommands[cmd]();
          if (res) {
            responseLine.innerHTML = res;
            terminalBody.appendChild(responseLine);
          }
        } else {
          responseLine.innerHTML = `<span class="term-dim">Directive '${rawCmd}' not recognized. Type <strong class="term-green">'help'</strong> for valid commands.</span>`;
          terminalBody.appendChild(responseLine);
        }

        if (window.animeAudio) window.animeAudio.playPuzzleClick();
        terminalBody.scrollTop = terminalBody.scrollHeight;
      } else if (e.key === 'ArrowUp') {
        if (historyIndex > 0) {
          historyIndex--;
          terminalInput.value = commandHistory[historyIndex];
        }
      } else if (e.key === 'ArrowDown') {
        if (historyIndex < commandHistory.length - 1) {
          historyIndex++;
          terminalInput.value = commandHistory[historyIndex];
        } else {
          historyIndex = commandHistory.length;
          terminalInput.value = '';
        }
      }
    });
  }

  // 8. Copy Email Interaction
  const copyEmailBtn = document.getElementById('copyEmailBtn');
  const copyEmailText = document.getElementById('copyEmailText');

  if (copyEmailBtn) {
    copyEmailBtn.addEventListener('click', async () => {
      const email = 'bomminenivarshith@gmail.com';
      try {
        await navigator.clipboard.writeText(email);
        copyEmailText.textContent = 'Copied to Clipboard!';
        if (window.animeAudio) window.animeAudio.playPuzzleClick();
        setTimeout(() => {
          copyEmailText.textContent = 'Copy Email';
        }, 2200);
      } catch (err) {
        window.location.href = `mailto:${email}`;
      }
    });
  }

  // 9. Contact Form Feedback
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('contactName').value;
      const email = document.getElementById('contactEmail').value;
      const message = document.getElementById('contactMessage').value;

      // Construct mailto as guaranteed client-side dispatch
      const subject = encodeURIComponent(`[Portfolio Contact] Directive from ${name}`);
      const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);
      window.location.href = `mailto:bomminenivarshith@gmail.com?subject=${subject}&body=${body}`;

      if (window.animeAudio) window.animeAudio.playKatanaSlash();
      contactForm.reset();
    });
  }

  // 10. Mobile Menu Toggle
  const mobileNavToggle = document.getElementById('mobileNavToggle');
  const navLinks = document.getElementById('navLinks');
  if (mobileNavToggle && navLinks) {
    mobileNavToggle.addEventListener('click', () => {
      navLinks.classList.toggle('mobile-open');
      if (window.animeAudio) window.animeAudio.playPuzzleClick();
    });

    document.querySelectorAll('.nav-link').forEach((link) => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('mobile-open');
      });
    });
  }

  // 11. Scroll Spy for Navigation Active State
  const sections = document.querySelectorAll('section[id]');
  window.addEventListener('scroll', () => {
    let scrollY = window.pageYOffset;
    sections.forEach((current) => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
      const sectionId = current.getAttribute('id');
      const navItem = document.querySelector(`.nav-link[href*="${sectionId}"]`);

      if (navItem && scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        navItem.classList.add('active');
      }
    });
  }, { passive: true });
});
