/* GSAP motion layer: preloader, reveals, scrub text, horizontal work, marquee, magnetic buttons. */
(function () {
  'use strict';
  try { gsap.registerPlugin(ScrollTrigger, SplitText); }
  catch (e) { gsap.registerPlugin(ScrollTrigger); }
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(pointer: fine)').matches;

  /* ---------- footer year ---------- */
  document.getElementById('year').textContent = new Date().getFullYear();

  /* ---------- mobile menu ---------- */
  const burger = document.getElementById('navBurger');
  const menu = document.getElementById('mobileMenu');
  burger.addEventListener('click', () => {
    const open = menu.classList.toggle('open');
    burger.setAttribute('aria-expanded', String(open));
    document.body.style.overflow = open ? 'hidden' : '';
  });
  menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    menu.classList.remove('open');
    burger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }));

  /* ---------- nav hide on scroll ---------- */
  const nav = document.getElementById('nav');
  let lastY = 0;
  ScrollTrigger.create({
    start: 80, end: 'max',
    onUpdate: (self) => {
      const y = self.scroll();
      nav.classList.toggle('hide', y > lastY && y > 220);
      lastY = y;
    }
  });

  /* ---------- preloader ---------- */
  const preloader = document.getElementById('preloader');
  const loadCount = document.getElementById('loadCount');
  const loadBar = document.getElementById('loadBar');
  const counter = { v: 0 };

  function heroIntro() {
    const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
    // split hero title into chars for staggered reveal
    let split = null;
    try {
      split = new SplitText('#heroTitle', { type: 'chars,words', charsClass: 'h-char' });
      gsap.set(split.chars, { yPercent: 110, opacity: 0 });
    } catch (e) { /* SplitText unavailable — graceful fallback */ }
    tl.to('.hero-eyebrow', { opacity: 1, y: 0, duration: .9 }, 0)
      .to('.hero-asset', { opacity: 1, y: 0, scale: 1, duration: 1.2 }, .1);
    if (split) tl.to(split.chars, { yPercent: 0, opacity: 1, duration: 1, stagger: 0.018 }, .15);
    else tl.to('#heroTitle', { opacity: 1, y: 0, duration: 1 }, .15);
    tl.to('#heroSub', { opacity: 1, y: 0, duration: .9 }, .5)
      .to('#heroCtas', { opacity: 1, y: 0, duration: .9 }, .65)
      .to('.hero-scroll', { opacity: 1, duration: .8 }, .9);
    return tl;
  }
  // initial hidden states (JS-driven so no-JS still shows content)
  gsap.set(['.hero-eyebrow', '#heroSub', '#heroCtas'], { opacity: 0, y: 26 });
  gsap.set('.hero-asset', { opacity: 0, y: 40, scale: .97 });
  gsap.set('.hero-scroll', { opacity: 0 });

  const introTl = gsap.timeline();
  introTl
    .to(counter, {
      v: 100, duration: reduceMotion ? .1 : .9, ease: 'power2.inOut',
      onUpdate: () => {
        loadCount.textContent = String(Math.round(counter.v)).padStart(2, '0');
        loadBar.style.width = counter.v + '%';
      }
    })
    .to(preloader, { yPercent: -100, duration: .9, ease: 'expo.inOut' }, '+=0.1')
    .set(preloader, { display: 'none' })
    .add(heroIntro(), '-=0.55');

  /* ---------- hero parallax on scroll ---------- */
  if (!reduceMotion) {
    gsap.to('.hero-grid', {
      yPercent: 14, opacity: .25, ease: 'none',
      scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: true,
        onUpdate: (self) => { if (window.setHeroFade) window.setHeroFade(self.progress); } }
    });
    gsap.to('.hero-asset', {
      y: -60, ease: 'none',
      scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: true }
    });
  }

  /* ---------- generic reveals ---------- */
  gsap.utils.toArray('[data-reveal]').forEach((el) => {
    gsap.to(el, {
      opacity: 1, y: 0, duration: 1.1, ease: 'expo.out',
      scrollTrigger: { trigger: el, start: 'top 88%', once: true }
    });
  });

  /* ---------- scrub word-reveal (about) ---------- */
  const scrubEl = document.getElementById('scrubText');
  if (scrubEl && !reduceMotion) {
    const words = scrubEl.textContent.trim().split(/\s+/);
    scrubEl.innerHTML = words.map(w => `<span class="w">${w}</span>`).join(' ');
    gsap.to('#scrubText .w', {
      opacity: 1, stagger: 0.06, ease: 'none',
      scrollTrigger: { trigger: scrubEl, start: 'top 80%', end: 'bottom 45%', scrub: 0.6 }
    });
  }

  /* ---------- stat counters ---------- */
  document.querySelectorAll('[data-count]').forEach((el) => {
    const target = parseInt(el.dataset.count, 10);
    ScrollTrigger.create({
      trigger: el, start: 'top 90%', once: true,
      onEnter: () => {
        const o = { v: 0 };
        gsap.to(o, { v: target, duration: 1.4, ease: 'power2.out',
          onUpdate: () => { el.textContent = Math.round(o.v); } });
      }
    });
  });

  /* ---------- horizontal work scroll (desktop) ---------- */
  const mm = gsap.matchMedia();
  mm.add('(min-width: 769px)', () => {
    const track = document.getElementById('workTrack');
    const pin = document.getElementById('workPin');
    const getScroll = () => track.scrollWidth - window.innerWidth;
    gsap.to(track, {
      x: () => -getScroll(), ease: 'none',
      scrollTrigger: {
        trigger: pin, start: 'top top+=80', end: () => '+=' + getScroll(),
        pin: true, scrub: 1, invalidateOnRefresh: true, anticipatePin: 1
      }
    });
  });
  // mobile: native horizontal swipe
  mm.add('(max-width: 768px)', () => {
    const track = document.getElementById('workTrack');
    track.style.overflowX = 'auto';
    track.style.width = '100%';
  });

  /* ---------- marquee reacts to scroll velocity ---------- */
  const marquee = document.getElementById('marqueeTrack');
  if (marquee && !reduceMotion) {
    const tween = gsap.to(marquee, { xPercent: -50, ease: 'none', duration: 26, repeat: -1 });
    marquee.style.animation = 'none'; // GSAP drives it now
    let resetTimer = null;
    ScrollTrigger.create({
      onUpdate: (self) => {
        const v = self.getVelocity();
        const target = gsap.utils.clamp(0.4, 5, 1 + Math.abs(v) / 2200) * (v < -50 ? -1 : 1);
        gsap.to(tween, { timeScale: target, duration: 0.3, overwrite: true });
        clearTimeout(resetTimer);
        resetTimer = setTimeout(() => gsap.to(tween, { timeScale: 1, duration: 1.2, overwrite: true }), 160);
      }
    });
  }

  /* ---------- magnetic buttons ---------- */
  if (finePointer && !reduceMotion) {
    document.querySelectorAll('.magnetic').forEach((btn) => {
      const strength = 22;
      btn.addEventListener('pointermove', (e) => {
        const r = btn.getBoundingClientRect();
        const x = e.clientX - r.left - r.width / 2;
        const y = e.clientY - r.top - r.height / 2;
        gsap.to(btn, { x: x / r.width * strength, y: y / r.height * strength, duration: .4, ease: 'power3.out' });
      });
      btn.addEventListener('pointerleave', () => {
        gsap.to(btn, { x: 0, y: 0, duration: .7, ease: 'elastic.out(1, .4)' });
      });
    });
  }

  /* ---------- image scroll parallax (scale baked in, GSAP owns the transform) ---------- */
  if (!reduceMotion) {
    gsap.utils.toArray('.bento-img img, .work-img img').forEach((img) => {
      gsap.fromTo(img, { yPercent: -7 }, {
        yPercent: 7, ease: 'none',
        scrollTrigger: { trigger: img.closest('.bento-img, .work-img'), start: 'top bottom', end: 'bottom top', scrub: true }
      });
    });
  }

  window.addEventListener('load', () => ScrollTrigger.refresh());
})();
