/**
 * Tilt & Interactive Spotlight Controller
 * Implements 3D card tilt and mouse-following spotlight reveal
 * conforms to modern CSS variables & pointer events.
 */

class TiltController {
  constructor(selector = '[data-tilt]') {
    this.elements = document.querySelectorAll(selector);
    this.init();
  }

  init() {
    if (!this.elements.length) return;

    this.elements.forEach((card) => {
      let rect = card.getBoundingClientRect();

      const updateRect = () => {
        rect = card.getBoundingClientRect();
      };

      const resizeObserver = new ResizeObserver(updateRect);
      resizeObserver.observe(card);

      card.addEventListener('pointerenter', () => {
        updateRect();
        card.style.transition = 'transform 0.1s ease-out, border-color 0.25s ease';
        if (window.animeAudio) window.animeAudio.playHoverTick();
      });

      card.addEventListener('pointermove', (e) => {
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Coordinates as percentages for CSS mask / radial gradient
        const px = (x / rect.width) * 100;
        const py = (y / rect.height) * 100;
        card.style.setProperty('--mouse-x', `${px}%`);
        card.style.setProperty('--mouse-y', `${py}%`);

        // 3D perspective tilt calculation
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -9;
        const rotateY = ((x - centerX) / centerX) * 9;

        card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateZ(8px)`;
      });

      card.addEventListener('pointerleave', () => {
        card.style.transition = 'transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1), border-color 0.3s ease';
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
      });
    });
  }
}

window.TiltController = TiltController;
