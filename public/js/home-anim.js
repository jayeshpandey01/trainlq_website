/* 
  home-anim.js — GSAP · Lenis Smooth Scroll · Magnetic Interactions
  TrainIQ | Premium AutoML Framework
*/

window.addEventListener('DOMContentLoaded', () => {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  gsap.registerPlugin(ScrollTrigger);

  /* ── 1. LENIS SMOOTH SCROLL ────────────────────────── */
  let lenis;
  if (typeof Lenis !== 'undefined') {
    lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
      infinite: false,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Synchronize ScrollTrigger with Lenis
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);
  }

  /* ── 2. GLOBAL DEFAULTS ────────────────────────────── */
  gsap.defaults({ force3D: true, lazy: true });
  ScrollTrigger.config({ limitCallbacks: true });

  /* ── 3. HERO ENTRANCE ──────────────────────────────── */
  const lines   = gsap.utils.toArray('.hero__line');
  const eyebrow = document.querySelector('.hero__eyebrow');
  const sub     = document.querySelector('.hero__sub');
  const actions = document.querySelector('.hero__actions');
  const scroll  = document.querySelector('.hero__scroll');

  gsap.set([eyebrow], { autoAlpha: 0, y: 30 });
  gsap.set(lines,     { autoAlpha: 0, y: 120, skewY: 7, rotate: 2 });
  gsap.set([sub, actions, scroll], { autoAlpha: 0, y: 40 });

  const heroTL = gsap.timeline({ delay: 0.2 });
  heroTL
    .to(eyebrow, { autoAlpha: 1, y: 0, duration: 0.8, ease: 'expo.out' })
    .to(lines,   { 
      autoAlpha: 1, y: 0, skewY: 0, rotate: 0, 
      duration: 1.4, ease: 'power4.out', stagger: 0.15 
    }, '-=0.5')
    .to([sub, actions], { autoAlpha: 1, y: 0, duration: 1, ease: 'power3.out', stagger: 0.12 }, '-=0.7')
    .to(scroll, { autoAlpha: 1, y: 0, duration: 0.8, ease: 'power2.out' }, '-=0.5');

  /* ── 4. MAGNETIC BUTTONS ───────────────────────────── */
  const magneticItems = gsap.utils.toArray('.hero__btn, .nav-menu-toggle, .pill-link');
  magneticItems.forEach(item => {
    item.addEventListener('mousemove', (e) => {
      const { clientX, clientY } = e;
      const { left, top, width, height } = item.getBoundingClientRect();
      const x = (clientX - (left + width / 2)) * 0.4;
      const y = (clientY - (top + height / 2)) * 0.4;
      
      gsap.to(item, {
        x: x, y: y,
        duration: 0.5, ease: 'power3.out', overwrite: 'auto'
      });
    });

    item.addEventListener('mouseleave', () => {
      gsap.to(item, {
        x: 0, y: 0,
        duration: 0.8, ease: 'elastic.out(1, 0.3)'
      });
    });
  });

  /* ── 5. MENU PANEL LOGIC ───────────────────────────── */
  const menuToggle = document.getElementById('menuToggle');
  const menuPanel = document.getElementById('menuPanel');
  let isMenuOpen = false;

  if (menuToggle && menuPanel) {
    const links = menuPanel.querySelectorAll('.menu-panel__link');
    
    // Initial state
    gsap.set(links, { y: 60, autoAlpha: 0 });

    menuToggle.addEventListener('click', () => {
      isMenuOpen = !isMenuOpen;
      menuToggle.classList.toggle('nav-menu-toggle--active', isMenuOpen);
      menuPanel.classList.toggle('menu-panel--open', isMenuOpen);
      document.body.classList.toggle('menu-is-open', isMenuOpen);

      if (isMenuOpen) {
        gsap.to(links, {
          y: 0, autoAlpha: 1, duration: 0.8, 
          ease: 'power4.out', stagger: 0.08, delay: 0.2
        });
        if (lenis) lenis.stop();
      } else {
        gsap.to(links, {
          y: 40, autoAlpha: 0, duration: 0.4, 
          ease: 'power2.in', stagger: -0.04
        });
        if (lenis) lenis.start();
      }
    });

    // Close on link click
    links.forEach(link => {
      link.addEventListener('click', () => {
        isMenuOpen = false;
        menuToggle.classList.remove('nav-menu-toggle--active');
        menuPanel.classList.remove('menu-panel--open');
        document.body.classList.remove('menu-is-open');
        if (lenis) lenis.start();
      });
    });
  }

  /* ── 6. SCROLL ANIMATIONS ──────────────────────────── */
  
  // Title Parallax
  lines.forEach((line, i) => {
    gsap.to(line, {
      x: i % 2 === 0 ? -80 : 80,
      ease: 'none',
      scrollTrigger: {
        trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1.5,
      }
    });
  });

  // Stagger Text Reveal (Description)
  const copy = document.querySelector('.sec-desc__copy');
  if (copy) {
    const rawText = copy.innerText;
    const words = rawText.trim().split(/\s+/);
    copy.innerHTML = words.map(w => `<span class="word">${w}</span>`).join(' ');

    gsap.fromTo(copy.querySelectorAll('.word'),
      { color: '#dedede' },
      {
        color: '#1a1a1a', ease: 'none',
        stagger: 0.05,
        scrollTrigger: { trigger: copy, start: 'top 80%', end: 'bottom 40%', scrub: 1.2 }
      }
    );
  }

  // Capability Cards
  gsap.from('.capability-card', {
    y: 60, autoAlpha: 0, duration: 1, ease: 'power3.out', stagger: 0.1,
    scrollTrigger: { trigger: '.capability-grid', start: 'top 85%' }
  });

  // Split section (text cards)
  gsap.from('.sec-split__card', {
    y: 50, autoAlpha: 0, duration: 0.9, ease: 'power4.out', stagger: 0.2,
    scrollTrigger: { trigger: '.sec-split', start: 'top 80%' }
  });

  // Metric Bars
  const bars = gsap.utils.toArray('.metric-bar, .hm-bar');
  bars.forEach(bar => {
    const targetW = bar.style.width || bar.style.getPropertyValue('--w') || '85%';
    gsap.set(bar, { width: '0%', opacity: 1 });
    gsap.to(bar, {
      width: targetW, duration: 1.5, ease: 'expo.out',
      scrollTrigger: { trigger: bar, start: 'top 90%' }
    });
  });

  // Wordmark Reveal
  gsap.from('.sec-brand__wordmark', {
    y: 80, autoAlpha: 0, duration: 1.3, ease: 'expo.out',
    scrollTrigger: { trigger: '.sec-brand__wordmark', start: 'top 92%' }
  });
});
