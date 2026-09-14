/**
 * Main Application Controller - Varshith Reddy Bommineni
 * Manages:
 * - Domain Shift Theme Engine (Blue Lock vs Demon Slayer)
 * - Audio SFX integrations
 * - Typewriter text rotator
 * - Interactive Skills filtering
 * - Terminal interactive CLI with full resume & project intelligence
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
  const contactTag = document.getElementById('contactTag');
  const awakenBtn = document.getElementById('awakenBtn');
  const footerQuote = document.getElementById('footerQuote');

  // Motion Avatar Elements
  const heroAvatarWrap = document.getElementById('heroAvatarWrap');
  const heroAvatarImg = document.getElementById('heroAvatarImg');
  const motionBadgeText = document.getElementById('motionBadgeText');

  // Avatar Modal Elements
  const avatarModal = document.getElementById('avatarModal');
  const avatarModalClose = document.getElementById('avatarModalClose');
  const avatarModalImg = document.getElementById('avatarModalImg');
  const avatarModalRank = document.getElementById('avatarModalRank');
  const avatarModalTitle = document.getElementById('avatarModalTitle');
  const avatarModalQuote = document.getElementById('avatarModalQuote');
  const specLabel1 = document.getElementById('specLabel1');
  const specVal1 = document.getElementById('specVal1');
  const specLabel2 = document.getElementById('specLabel2');
  const specVal2 = document.getElementById('specVal2');
  const specLabel3 = document.getElementById('specLabel3');
  const specVal3 = document.getElementById('specVal3');
  const specLabel4 = document.getElementById('specLabel4');
  const specVal4 = document.getElementById('specVal4');
  const avatarModalShiftBtn = document.getElementById('avatarModalShiftBtn');
  const modalShiftBtnText = document.getElementById('modalShiftBtnText');
  const avatarDownloadBtn = document.getElementById('avatarDownloadBtn');

  const savedTheme = localStorage.getItem('portfolio_theme') || 'bluelock';
  applyTheme(savedTheme, false);

  function applyTheme(theme, playSound = true) {
    document.body.dataset.theme = theme;
    localStorage.setItem('portfolio_theme', theme);
    if (canvasEngine) canvasEngine.setTheme(theme);

    // Trigger visual anime shift flash on avatar
    if (heroAvatarWrap) {
      heroAvatarWrap.classList.add('avatar-shifting');
      setTimeout(() => heroAvatarWrap.classList.remove('avatar-shifting'), 500);
    }

    if (theme === 'bluelock') {
      themeLabel.textContent = 'EGO MODE (BLUE LOCK)';
      heroBadgeText.textContent = 'METAVISION ACTIVE • READY FOR INTERNSHIP';
      kanjiWatermark.textContent = '世界一のエゴイスト';
      hudRankTop.textContent = 'RANK S // EGOIST';
      avatarTagline.textContent = '覚醒・FLOW STATE';
      statusTag.textContent = 'METAVISION SCAN REPORT';
      skillsTag.textContent = 'BREATHING TECHNIQUES & WEAPONS';
      projectsTag.textContent = 'OFFICIAL MATCHES & COMBAT ARCHIVE';
      contactTag.textContent = 'DIRECT CONNECTION PROTOCOL';
      awakenBtn.innerHTML = '<span>⚡ AWAKEN EGO</span>';
      footerQuote.textContent = '「 世界一のエゴイストでなければ、世界一のストライカーにはなれない 」';

      // Blue Lock Motion Avatar
      if (heroAvatarImg) {
        heroAvatarImg.src = 'assets/avatar_bluelock_motion.gif';
        heroAvatarImg.alt = 'Varshith Reddy Anime Motion Avatar - Blue Lock Egoist';
      }
      if (motionBadgeText) motionBadgeText.textContent = 'METAVISION MOTION';

      // Blue Lock Modal Spec Sync
      if (avatarModalImg) avatarModalImg.src = 'assets/avatar_bluelock_motion.gif';
      if (avatarModalRank) avatarModalRank.textContent = 'RANK S // EGOIST STRIKER';
      if (avatarModalTitle) avatarModalTitle.textContent = 'Isagi Yoichi x Solo Leveling Shadow Form';
      if (avatarModalQuote) avatarModalQuote.textContent = '"In this domain, I adapt and devour every dimensional match."';
      if (specLabel1) specLabel1.textContent = 'EGO QUOTIENT';
      if (specVal1) specVal1.textContent = '99.8% // MONARCH';
      if (specLabel2) specLabel2.textContent = 'METAVISION SCAN';
      if (specVal2) specVal2.textContent = '360° SPATIAL FLOW';
      if (specLabel3) specLabel3.textContent = 'WEAPON PROTOCOL';
      if (specVal3) specVal3.textContent = 'DIRECT SHOT & RUNIC BLADE';
      if (specLabel4) specLabel4.textContent = 'DOMAIN ENGINE';
      if (specVal4) specVal4.textContent = 'SHADOW REVERSION (BLUELOCK)';
      if (modalShiftBtnText) modalShiftBtnText.textContent = '🔥 SHIFT TO DEMON SLAYER';
      if (avatarDownloadBtn) {
        avatarDownloadBtn.href = 'assets/avatar_bluelock_motion.gif';
        avatarDownloadBtn.setAttribute('download', 'varshith_reddy_avatar_bluelock_motion.gif');
      }
    } else {
      themeLabel.textContent = 'BREATHING MODE (DEMON SLAYER)';
      heroBadgeText.textContent = 'TOTAL CONCENTRATION • HASHIRA INTERN';
      kanjiWatermark.textContent = '全集中・常中';
      hudRankTop.textContent = 'HASHIRA // SUN BREATHING';
      avatarTagline.textContent = '心を燃やせ・SET HEART ABLAZE';
      statusTag.textContent = 'HASHIRA COMBAT ASSESSMENT';
      skillsTag.textContent = 'BREATHING FORMS & NICHIRIN BLADES';
      projectsTag.textContent = 'DEMON SLAYING EXPEDITIONS';
      contactTag.textContent = 'KASUGAI CROW DISPATCH';
      awakenBtn.innerHTML = '<span>🔥 HINOKAMI KAGURA</span>';
      footerQuote.textContent = '「 胸を張って生きろ。己の弱さや不甲斐なさにどれだけ打ちのめされようと、心を燃やせ 」';

      // Demon Slayer Motion Avatar
      if (heroAvatarImg) {
        heroAvatarImg.src = 'assets/avatar_demonslayer_motion.gif';
        heroAvatarImg.alt = 'Varshith Reddy Anime Motion Avatar - Sun & Water Breathing Hashira';
      }
      if (motionBadgeText) motionBadgeText.textContent = 'BREATHING MOTION';

      // Demon Slayer Modal Spec Sync
      if (avatarModalImg) avatarModalImg.src = 'assets/avatar_demonslayer_motion.gif';
      if (avatarModalRank) avatarModalRank.textContent = 'HASHIRA // SUN & WATER BREATHING';
      if (avatarModalTitle) avatarModalTitle.textContent = 'Kamado Tanjiro Hinokami Kagura Form';
      if (avatarModalQuote) avatarModalQuote.textContent = '"Set your heart ablaze. Overcome every limit with Total Concentration."';
      if (specLabel1) specLabel1.textContent = 'BREATHING STYLE';
      if (specVal1) specVal1.textContent = 'SUN & WATER DUAL BREATH';
      if (specLabel2) specLabel2.textContent = 'CONCENTRATION';
      if (specVal2) specVal2.textContent = 'TOTAL CONCENTRATION CONSTANT';
      if (specLabel3) specLabel3.textContent = 'NICHIRIN BLADE';
      if (specVal3) specVal3.textContent = 'BLACK NICHIRIN // CRIMSON RED';
      if (specLabel4) specLabel4.textContent = 'HASHIRA DOMAIN';
      if (specVal4) specVal4.textContent = 'DEMON SLAYER CORPS ARCHIVE';
      if (modalShiftBtnText) modalShiftBtnText.textContent = '⚡ SHIFT TO BLUE LOCK';
      if (avatarDownloadBtn) {
        avatarDownloadBtn.href = 'assets/avatar_demonslayer_motion.gif';
        avatarDownloadBtn.setAttribute('download', 'varshith_reddy_avatar_demonslayer_motion.gif');
      }
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

  // Avatar Modal Open / Close Controller
  if (heroAvatarWrap && avatarModal) {
    const openAvatarModal = () => {
      avatarModal.classList.add('active');
      avatarModal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      if (window.animeAudio) window.animeAudio.playPuzzleClick();
    };

    const closeAvatarModal = () => {
      avatarModal.classList.remove('active');
      avatarModal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      if (window.animeAudio) window.animeAudio.playPuzzleClick();
    };

    heroAvatarWrap.addEventListener('click', openAvatarModal);
    heroAvatarWrap.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openAvatarModal();
      }
    });

    if (avatarModalClose) {
      avatarModalClose.addEventListener('click', closeAvatarModal);
    }

    avatarModal.addEventListener('click', (e) => {
      if (e.target === avatarModal) {
        closeAvatarModal();
      }
    });

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && avatarModal.classList.contains('active')) {
        closeAvatarModal();
      }
    });

    if (avatarModalShiftBtn) {
      avatarModalShiftBtn.addEventListener('click', () => {
        const current = document.body.dataset.theme || 'bluelock';
        const next = current === 'bluelock' ? 'demonslayer' : 'bluelock';
        applyTheme(next, true);
      });
    }
  }

  // 4. Awakening Special Power Burst & Anime Cutscene
  awakenBtn.addEventListener('click', () => {
    const currentTheme = document.body.dataset.theme || 'bluelock';

    // 1. Play theme-specific awakening audio
    if (window.animeAudio) {
      if (currentTheme === 'demonslayer') {
        window.animeAudio.playHinokamiCutsceneSound();
      } else {
        window.animeAudio.playDirectShotCutsceneSound();
      }
    }

    // 2. Trigger Fullscreen Anime Cutscene (Tanjiro Dual Slash / Isagi Dual Direct Shot)
    if (window.animeCutscene) {
      window.animeCutscene.triggerAwakening(currentTheme);
    }

    // 3. Ambient Canvas background power bursts
    const w = window.innerWidth;
    const h = window.innerHeight;
    for (let i = 0; i < 6; i++) {
      setTimeout(() => {
        const x = Math.random() * (w * 0.8) + (w * 0.1);
        const y = Math.random() * (h * 0.8) + (h * 0.1);
        if (canvasEngine) canvasEngine.triggerBurst(x, y);
      }, i * 100);
    }
  });

  // 5. Dynamic Typewriter Effect
  const typewriterElement = document.getElementById('typewriter');
  const roles = [
    'AI/ML Engineer & SDE Intern',
    'GenAI & LangGraph Architect',
    'Computer Vision & Distributed Systems',
    'FastAPI & Cloud Backend Developer',
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
      typingDelay = 1800;
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

  // 7. Interactive CLI Terminal (Full Resume & Project Intelligence)
  const terminalInput = document.getElementById('terminalInput');
  const terminalBody = document.getElementById('terminalBody');
  const commandHistory = [];
  let historyIndex = -1;

  const terminalCommands = {
    help: () => `
<div class="term-cyan">=== AVAILABLE DIRECTIVES ===</div>
- <strong class="term-green">about</strong>: Profile overview, education, and philosophy
- <strong class="term-green">projects</strong>: Inspect all 9 end-to-end projects with GitHub links
- <strong class="term-green">skills</strong>: View technical arsenal & frameworks
- <strong class="term-green">experience</strong>: Review internship at Skillumni
- <strong class="term-green">certifications</strong>: AWS Developer Associate, Oracle, NPTEL
- <strong class="term-green">contact</strong>: Direct email, phone, and LinkedIn channels
- <strong class="term-green">hire</strong>: Internship availability & readiness
- <strong class="term-green">theme</strong>: Toggle Blue Lock vs Demon Slayer modes
- <strong class="term-green">awaken</strong>: Unleash maximum chemical reaction / Hinokami burst
- <strong class="term-green">clear</strong>: Wipe terminal logs
    `,
    about: () => `
<div class="term-cyan">[EVALUATION RECORD]</div>
<strong>Name:</strong> Varshith Reddy Bommineni<br>
<strong>Education:</strong> B.Tech in CSE (Specialization in AI/ML), Lovely Professional University (2022 - 2026)<br>
<strong>Target:</strong> 1st Internship in AI/ML Engineering & Full-Stack SDE<br>
<strong>Philosophy:</strong> Blending the tactical foresight of Blue Lock's Metavision with the relentless discipline of Demon Slayer's Sun Breathing to build production-grade intelligence systems.
    `,
    projects: () => `
<div class="term-cyan">[9 END-TO-END PROJECT ARSENAL]</div>
1. <a href="https://github.com/varshith0810/PashuDrishti.ai" target="_blank" class="term-green"><strong>PashuDrishti.ai</strong></a>: 11k+ image livestock vision system, ONNX quantized, 120+ inf/s on AWS.<br>
2. <a href="https://github.com/varshith0810/MarketPrism" target="_blank" class="term-green"><strong>MarketPrism</strong></a>: LangGraph financial intelligence engine, 16+ feeds, Redis cache, 450+ RPS.<br>
3. <a href="https://github.com/varshith0810/taskflow" target="_blank" class="term-green"><strong>TaskFlow</strong></a>: High-concurrency task orchestration with FastAPI, PostgreSQL, AWS SQS & Lambda.<br>
4. <a href="https://github.com/varshith0810/CodeCub" target="_blank" class="term-green"><strong>CodeCub</strong></a>: LangGraph multi-agent software engineering team (Planner, Architect, Coder).<br>
5. <a href="https://github.com/varshith0810/TriageAI" target="_blank" class="term-green"><strong>TriageAI</strong></a>: GitHub issue triage POC evaluating 24+ LLMs with 95%+ accuracy.<br>
6. <a href="https://github.com/varshith0810/MediMind" target="_blank" class="term-green"><strong>MediMind</strong></a>: High-precision medical document RAG with Qdrant and SQLite FTS5.<br>
7. <a href="https://github.com/varshith0810/BuddyHire" target="_blank" class="term-green"><strong>BuddyHire</strong></a>: AI talent recruiter with Model Context Protocol (MCP) server.<br>
8. <a href="https://github.com/varshith0810/EyeQ" target="_blank" class="term-green"><strong>EyeQ</strong></a>: Student engagement & emotion classifier across 6 cognitive states.<br>
9. <a href="https://github.com/varshith0810/DataPantry" target="_blank" class="term-green"><strong>DataPantry</strong></a>: Medallion Architecture (Bronze->Silver->Gold) data warehouse & ETL.
    `,
    skills: () => `
<div class="term-cyan">[TECHNICAL ARSENAL]</div>
- <strong class="term-purple">Languages:</strong> Python, SQL, Java, C++, JavaScript/TypeScript<br>
- <strong class="term-purple">AI / ML:</strong> PyTorch, OpenCV, ONNX Runtime, LangChain, LangGraph, Hugging Face, Scikit-learn<br>
- <strong class="term-purple">Cloud & DevOps:</strong> AWS (Lambda, SQS, SNS, RDS, S3, Cognito, ECS, EC2), Docker, CI/CD<br>
- <strong class="term-purple">Databases:</strong> PostgreSQL, MySQL, Redis, DynamoDB, SQLite, SQL Server<br>
- <strong class="term-purple">Tools & Tracing:</strong> Langfuse, Postman, Power BI, Git, Linux/Bash, PyTest
    `,
    experience: () => `
<div class="term-cyan">[WORK EXPERIENCE]</div>
<strong>Skillumni</strong> — Business Development Associate (Technical Solutions Intern)<br>
<span class="term-dim">July 2024 – Present | Remote</span><br>
• Led technical discovery sessions for enterprise clients to secure 12 client software adoptions.<br>
• Built custom Python data extraction scripts and SQL pipelines, slashing issue turnaround by 30%.<br>
• Boosted client onboarding efficiency by 25% by configuring API workflows.
    `,
    certifications: () => `
<div class="term-cyan">[VERIFIED CREDENTIALS]</div>
• <strong>AWS:</strong> Certified Developer Associate / Cloud Solutions<br>
• <strong>Oracle:</strong> Agentic AI Foundations Associate<br>
• <strong>Oracle:</strong> Data Platform Associate<br>
• <strong>NPTEL:</strong> Cloud Computing Certification
    `,
    contact: () => `
<div class="term-cyan">[COMMUNICATION CHANNELS]</div>
• <strong>Email:</strong> <a href="mailto:bomminenivarshith@gmail.com" class="term-green">bomminenivarshith@gmail.com</a><br>
• <strong>Phone / WhatsApp:</strong> <a href="tel:+917986139387" class="term-green">+91-7986139387</a><br>
• <strong>LinkedIn:</strong> <a href="https://linkedin.com/in/varshith-reddy-bommineni" target="_blank" class="term-green">linkedin.com/in/varshith-reddy-bommineni</a><br>
• <strong>GitHub:</strong> <a href="https://github.com/varshith0810" target="_blank" class="term-green">github.com/varshith0810</a>
    `,
    hire: () => `
<div class="term-green">[INTERNSHIP READINESS: 100% ACTIVE]</div>
Actively interviewing for Summer/Fall AI/ML Engineer & SDE Internship opportunities.<br>
Ready to build, deploy, and optimize production pipelines immediately. Remote or on-site ready!
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

        const logLine = document.createElement('div');
        logLine.className = 'terminal-log';
        logLine.innerHTML = `<span class="term-prompt">varshith&gt;</span> ${rawCmd}`;
        terminalBody.appendChild(logLine);

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

      const subject = encodeURIComponent(`[Internship Opportunity / Inquiry] Directive from ${name}`);
      const body = encodeURIComponent(`Sender: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);
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
