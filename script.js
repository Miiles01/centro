(() => {
  const d = document, root = d.documentElement;
  const $ = (s, c = d) => [...c.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const DATA = window.UGC_DATA;

  /* ==========================================================================
     1. RENDER DINÁMICO DESDE data.js
     ========================================================================== */
  if (DATA) {
    // 1.1 Marcas (Logos con SVG mask para color monocromático de la paleta)
    const brandGrid = d.getElementById('brand-grid-target');
    if (brandGrid && DATA.brands) {
      brandGrid.innerHTML = DATA.brands.map(b => `
        <div class="brand-logo" title="${b.name}">
          <span class="brand-logo-icon" style="-webkit-mask-image: url('${DATA.media.base}${b.logo}'); mask-image: url('${DATA.media.base}${b.logo}');" aria-label="${b.name}" role="img"></span>
        </div>
      `).join('');
    }

    // 1.2 Carrusel (Reels & Fotos 9:16)
    const track = d.querySelector('.reel-track');
    if (track && DATA.carousel) {
      track.innerHTML = DATA.carousel.map(item => {
        const isVid = item.type === 'video';
        const fileUrl = `${DATA.media.base}${item.file}`;
        return `
          <button type="button" class="reel-card" data-type="${item.type}" data-src="${fileUrl}" aria-label="Ver ${item.title}">
            <div class="reel-media">
              ${isVid
                ? `<video src="${fileUrl}" muted loop playsinline preload="metadata"></video><span class="reel-play" aria-hidden="true">▶</span>`
                : `<img src="${fileUrl}" alt="${item.title}" loading="lazy">`
              }
            </div>
            <h3 class="reel-title">${item.title}</h3>
            <span class="reel-meta">${item.format} · ${item.niche}</span>
          </button>
        `;
      }).join('');
    }

    // 1.3 Nichos
    const nichesTarget = d.getElementById('niches-target');
    if (nichesTarget && DATA.niches) {
      nichesTarget.innerHTML = DATA.niches.map(n => `
        <li class="text-item">
          <span class="num">${n.id}</span>
          <div class="text-col">
            <h3>${n.name}</h3>
            <p class="muted">${n.detail}</p>
          </div>
        </li>
      `).join('');
    }

    // 1.4 Qué tipo de contenido hago
    const contentTypesTarget = d.getElementById('content-types-target');
    if (contentTypesTarget && DATA.contentTypes) {
      contentTypesTarget.innerHTML = DATA.contentTypes.map(c => `
        <li class="text-item">
          <span class="num">${c.id}</span>
          <div class="text-col">
            <h3>${c.title}</h3>
            <p class="muted">Ej.: ${c.example}</p>
          </div>
        </li>
      `).join('');
    }

    // 1.5 Testimonios (6 testimonios)
    const testiTarget = d.getElementById('testimonials-target');
    if (testiTarget && DATA.testimonials) {
      testiTarget.innerHTML = DATA.testimonials.map(t => `
        <article class="testi-card">
          <p class="testi-quote">“${t.quote}”</p>
          <div class="testi-author">
            <img class="testi-avatar" src="${DATA.media.base}${t.avatar}" alt="${t.role}, ${t.company}" loading="lazy">
            <div class="testi-info">
              <span class="testi-role">${t.role}</span>
              <span class="testi-company">${t.company}</span>
            </div>
          </div>
        </article>
      `).join('');
    }
  }

  /* ==========================================================================
     2. CARRUSEL: NAVEGACIÓN, ARRASTRE, AUTOPLAY Y BARRA DE PROGRESO
     ========================================================================== */
  const track = d.querySelector('.reel-track');
  const prevBtn = d.querySelector('.reel-btn[data-dir="-1"]');
  const nextBtn = d.querySelector('.reel-btn[data-dir="1"]');
  const progressBar = d.getElementById('reel-progress-bar');
  let isDragging = false, startX = 0, scrollLeft = 0, moved = false;

  const updateProgress = () => {
    if (!track) return;
    const maxScroll = track.scrollWidth - track.clientWidth;
    const ratio = maxScroll > 0 ? track.scrollLeft / maxScroll : 0;
    if (progressBar) progressBar.style.width = Math.min(100, Math.max(0, ratio * 100)) + '%';
    if (prevBtn) prevBtn.disabled = track.scrollLeft <= 5;
    if (nextBtn) nextBtn.disabled = track.scrollLeft >= maxScroll - 5;
  };

  if (track) {
    track.addEventListener('scroll', updateProgress, { passive: true });
    updateProgress();

    // Flechas
    if (prevBtn) prevBtn.addEventListener('click', () => {
      track.scrollBy({ left: -track.clientWidth * 0.7, behavior: 'smooth' });
    });
    if (nextBtn) nextBtn.addEventListener('click', () => {
      track.scrollBy({ left: track.clientWidth * 0.7, behavior: 'smooth' });
    });

    // Arrastre con mouse (drag to scroll)
    track.addEventListener('mousedown', e => {
      isDragging = true;
      moved = false;
      track.classList.add('is-dragging');
      startX = e.pageX - track.offsetLeft;
      scrollLeft = track.scrollLeft;
    });
    window.addEventListener('mousemove', e => {
      if (!isDragging) return;
      const x = e.pageX - track.offsetLeft;
      const walk = (x - startX) * 1.5;
      if (Math.abs(walk) > 5) moved = true;
      track.scrollLeft = scrollLeft - walk;
    });
    window.addEventListener('mouseup', () => {
      if (!isDragging) return;
      isDragging = false;
      track.classList.remove('is-dragging');
    });

    // Reproducción de video silenciado solo cuando esté visible en pantalla
    if ('IntersectionObserver' in window) {
      const vObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          const vid = entry.target;
          if (entry.isIntersecting) {
            vid.play().catch(() => {});
          } else {
            vid.pause();
          }
        });
      }, { threshold: 0.5 });
      track.querySelectorAll('video').forEach(v => vObserver.observe(v));
    }
  }

  /* ==========================================================================
     3. VISOR LIGHTBOX (MODAL DE VIDEO CON SONIDO O FOTO)
     ========================================================================== */
  const viewer = d.getElementById('visor');
  const stage = viewer ? viewer.querySelector('.viewer-stage') : null;
  const viewerClose = viewer ? viewer.querySelector('.viewer-close') : null;
  let lenisInstance = null;
  let lastFocusedCard = null;

  const openViewer = card => {
    if (!viewer || !stage) return;
    lastFocusedCard = card;
    const type = card.dataset.type;
    const src = card.dataset.src;

    if (type === 'video') {
      stage.innerHTML = `<video src="${src}" controls autoplay playsinline></video>`;
    } else {
      stage.innerHTML = `<img src="${src}" alt="Vista ampliada">`;
    }

    viewer.classList.add('is-open');
    root.classList.add('lock');
    if (lenisInstance) lenisInstance.stop();
    if (viewerClose) viewerClose.focus();
  };

  const closeViewer = () => {
    if (!viewer || !viewer.classList.contains('is-open')) return;
    viewer.classList.remove('is-open');
    root.classList.remove('lock');
    if (lenisInstance) lenisInstance.start();
    setTimeout(() => { if (stage) stage.innerHTML = ''; }, 300);
    if (lastFocusedCard) lastFocusedCard.focus();
  };

  if (track) {
    track.querySelectorAll('.reel-card').forEach(card => {
      card.addEventListener('click', () => {
        if (!moved) openViewer(card);
      });
    });
  }
  if (viewer) {
    viewer.addEventListener('click', e => {
      if (e.target === viewer) closeViewer();
    });
  }
  if (viewerClose) viewerClose.addEventListener('click', closeViewer);
  addEventListener('keydown', e => {
    if (e.key === 'Escape' && viewer && viewer.classList.contains('is-open')) closeViewer();
  });

  /* ==========================================================================
     4. MENÚ MÓVIL (SHEET)
     ========================================================================== */
  const sheet = d.getElementById('sheet'), burger = d.querySelector('.burger');
  const setSheet = open => {
    if (!sheet || !burger) return;
    sheet.classList.toggle('open', open);
    sheet.setAttribute('aria-hidden', !open);
    burger.classList.toggle('on', open);
    burger.setAttribute('aria-expanded', open);
    burger.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
    root.classList.toggle('lock', open);
    paintBar();
    lenisInstance && (open ? lenisInstance.stop() : lenisInstance.start());
  };
  if (burger) burger.addEventListener('click', () => setSheet(!sheet.classList.contains('open')));
  addEventListener('keydown', e => e.key === 'Escape' && setSheet(false));
  matchMedia('(min-width: 900px)').addEventListener('change', e => e.matches && setSheet(false));

  /* ==========================================================================
     5. BARRA FIJA SUPERIOR & LINKS ACTIVOS
     ========================================================================== */
  const bar = d.querySelector('.bar'), hero = d.querySelector('.hero');
  const paintBar = () => {
    if (!bar || !hero) return;
    const past = scrollY > hero.offsetHeight - bar.offsetHeight - 8;
    bar.classList.toggle('is-solid', past && (!sheet || !sheet.classList.contains('open')));
  };
  addEventListener('scroll', paintBar, { passive: true });
  addEventListener('resize', paintBar);
  paintBar();

  // Scrollspy
  const links = $('.nav a');
  const watched = links.map(a => d.querySelector(a.getAttribute('href'))).filter(Boolean);
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(entries => entries.forEach(e => {
      if (!e.isIntersecting) return;
      links.forEach(a => a.classList.toggle('is-active', a.getAttribute('href') === '#' + e.target.id));
    }), { rootMargin: '-40% 0px -50% 0px' });
    watched.forEach(el => io.observe(el));
  }

  /* ==========================================================================
     6. GSAP, SMOOTH SCROLL (LENIS) & ANIMACIONES EDITORIALES
     ========================================================================== */
  if (!window.gsap || !window.ScrollTrigger || reduce) {
    $('a[href^="#"]').forEach(a => a.addEventListener('click', () => setSheet(false)));
    return;
  }

  root.classList.add('js');
  gsap.registerPlugin(ScrollTrigger);
  ScrollTrigger.config({ ignoreMobileResize: true });

  // Smooth scroll con Lenis
  if (window.Lenis) {
    lenisInstance = new Lenis({ lerp: .09, smoothWheel: true });
    lenisInstance.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(t => lenisInstance.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
  }

  // Scroll suave al hacer clic en enlaces ancla
  $('a[href^="#"]').forEach(a => a.addEventListener('click', e => {
    const id = a.getAttribute('href');
    const target = id.length > 1 ? d.querySelector(id) : d.body;
    if (!target) return;
    e.preventDefault();
    setSheet(false);
    const offset = id === '#top' ? 0 : bar.offsetHeight + 10;
    if (lenisInstance) {
      lenisInstance.scrollTo(target, { offset: -offset, duration: 1.2 });
    } else {
      window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - offset, behavior: 'smooth' });
    }
  }));

  // Barra de progreso global superior
  gsap.to('.progress', {
    scaleX: 1, ease: 'none',
    scrollTrigger: { trigger: d.body, start: 'top top', end: 'bottom bottom', scrub: true }
  });

  // Título Hero línea por línea
  $('[data-split]').forEach(h => {
    const spans = $('span', h);
    if (!spans.length) return;
    gsap.from(spans, {
      y: 60, opacity: 0, duration: 1.2, ease: 'power3.out', stagger: 0.12, delay: 0.2
    });
  });

  // Textos y párrafos en reveal
  gsap.set('.line', { y: 35, opacity: 0 });
  ScrollTrigger.batch('.line', {
    start: 'top 90%', once: true,
    onEnter: els => gsap.to(els, {
      y: 0, opacity: 1, stagger: 0.18, duration: 0.85, ease: 'power2.out', clearProps: 'transform'
    })
  });

  // Reveal de títulos
  gsap.set('.reveal', { y: 40, opacity: 0 });
  ScrollTrigger.batch('.reveal', {
    start: 'top 88%', once: true,
    onEnter: els => gsap.to(els, {
      y: 0, opacity: 1, stagger: 0.12, duration: 0.9, ease: 'power3.out', clearProps: 'transform'
    })
  });

  // Línea divisoria animada en Nichos y Contenido
  $('.text-item').forEach(el => ScrollTrigger.create({
    trigger: el, start: 'top 90%', once: true,
    onEnter: () => gsap.to(el, { '--line': 1, duration: 1.4, ease: 'expo.out' })
  }));

  // Animaciones por responsive
  const mm = gsap.matchMedia();
  mm.add({ wide: '(min-width: 768px)', narrow: '(max-width: 767px)' }, ctx => {
    const narrow = ctx.conditions.narrow;

    // Parallax del Hero
    gsap.to('.hero-img', {
      yPercent: 20, ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true }
    });
    gsap.to('.hero-overlay', {
      opacity: 1.2, ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true }
    });

    // Bleed Quote (Parallax y expansión de imagen)
    $('.bleed').forEach(b => {
      const img = b.querySelector('.bleed-img');
      if (img) {
        gsap.fromTo(img, { yPercent: -12 }, {
          yPercent: 12, ease: 'none',
          scrollTrigger: { trigger: b, start: 'top bottom', end: 'bottom top', scrub: true }
        });
      }
    });

    // Imagen Sobre mí con cortina
    $('.ratio-23').forEach(box => {
      gsap.fromTo(box, { clipPath: 'inset(0% 0% 100% 0%)' }, {
        clipPath: 'inset(0% 0% 0% 0%)', duration: 1.5, ease: 'expo.inOut',
        scrollTrigger: { trigger: box, start: 'top 85%', once: true }
      });
      gsap.from(box.querySelector('img'), {
        scale: 1.25, duration: 1.8, ease: 'expo.out',
        scrollTrigger: { trigger: box, start: 'top 85%', once: true }
      });
    });

    // Split text float
    if (!narrow) {
      $('.split-text').forEach(t => gsap.fromTo(t, { y: 40 }, {
        y: -40, ease: 'none',
        scrollTrigger: { trigger: t.closest('.split'), start: 'top bottom', end: 'bottom top', scrub: true }
      }));
    }
  });

  // Marquee infinito controlado por velocidad de scroll
  const tweens = $('.marquee-track').map(t => gsap.to(t, { xPercent: -50, ease: 'none', duration: 40, repeat: -1 }));
  let boost = 0, dir = 1, last = scrollY;
  gsap.ticker.add(() => {
    const v = lenisInstance ? lenisInstance.velocity : scrollY - last;
    last = scrollY;
    if (Math.abs(v) > .1) dir = v > 0 ? 1 : -1;
    boost += (Math.min(Math.abs(v), 40) * .3 - boost) * .08;
    tweens.forEach(t => t.timeScale(dir * (1 + boost)));
  });

  // Cursor personalizado y botones magnéticos
  if (fine) {
    const c = d.querySelector('.cursor');
    gsap.set(c, { xPercent: -50, yPercent: -50, opacity: 0 });
    const qx = gsap.quickTo(c, 'x', { duration: .45, ease: 'power3' });
    const qy = gsap.quickTo(c, 'y', { duration: .45, ease: 'power3' });
    addEventListener('pointermove', e => {
      qx(e.clientX); qy(e.clientY);
      gsap.to(c, { opacity: 1, duration: .3, overwrite: 'auto' });
    });
    $('a, button').forEach(el => {
      el.addEventListener('pointerenter', () => gsap.to(c, { scale: 2.8, duration: .35, ease: 'power3' }));
      el.addEventListener('pointerleave', () => gsap.to(c, { scale: 1, duration: .35, ease: 'power3' }));
    });
    $('.btn').forEach(b => {
      b.addEventListener('pointermove', e => {
        const r = b.getBoundingClientRect();
        gsap.to(b, { x: (e.clientX - r.left - r.width / 2) * .25, y: (e.clientY - r.top - r.height / 2) * .35, duration: .4, ease: 'power3' });
      });
      b.addEventListener('pointerleave', () => gsap.to(b, { x: 0, y: 0, duration: 0.8, ease: 'elastic.out(1, .4)' }));
    });
  }

  addEventListener('load', () => ScrollTrigger.refresh());
})();
