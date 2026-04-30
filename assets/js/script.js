/* ============================================
   STUDIO D'LÚ - JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* --- Navbar Scroll Effect --- */
  const navbar = document.querySelector('.navbar');
  const onScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* --- Mobile Menu --- */
  const hamburger = document.querySelector('.nav-hamburger');
  const navLinks = document.querySelector('.nav-links');

  hamburger?.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('open');
    const expanded = hamburger.classList.contains('active');
    hamburger.setAttribute('aria-expanded', expanded);
  });

  navLinks?.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navLinks.classList.remove('open');
    });
  });

  /* --- Hero Background Carousel (clip-path transitions) --- */
  const slides = document.querySelectorAll('.hero-bg-slide');
  const indicatorsContainer = document.querySelector('.hero-indicators');
  let currentSlide = 0;
  let slideTimer = null;
  const SLIDE_DURATION = 6000;
  const TRANSITION_DURATION = 1500;

  // Tipos de transição rotativos
  const transitions = ['transition-diagonal', 'transition-circle', 'transition-split', 'transition-diamond'];

  function cleanSlideClasses(slide) {
    slide.classList.remove('active', 'exiting', 'exit-zoom',
      'transition-diagonal', 'transition-circle', 'transition-split', 'transition-diamond');
  }

  function resetIndicators() {
    const dots = indicatorsContainer.querySelectorAll('.hero-indicator');
    dots.forEach(d => d.classList.remove('active'));
  }

  function activateIndicator(index) {
    resetIndicators();
    const dots = indicatorsContainer.querySelectorAll('.hero-indicator');
    if (dots[index]) {
      dots[index].style.animation = 'none';
      dots[index].offsetHeight; // force reflow
      dots[index].style.animation = '';
      dots[index].classList.add('active');
    }
  }

  function goToSlide(index) {
    if (index === currentSlide && slides[currentSlide].classList.contains('active')) return;

    const prevSlide = slides[currentSlide];
    const nextSlideEl = slides[index];

    // Transição de saída: zoom + blur + fade
    cleanSlideClasses(prevSlide);
    prevSlide.classList.add('exit-zoom');

    // Transição de entrada: clip-path reveal
    const transitionType = transitions[index % transitions.length];
    cleanSlideClasses(nextSlideEl);
    nextSlideEl.classList.add(transitionType, 'active');

    currentSlide = index;
    activateIndicator(currentSlide);

    // Limpa o slide anterior após transição
    setTimeout(() => {
      prevSlide.classList.remove('exit-zoom');
    }, TRANSITION_DURATION);
  }

  function nextSlide() {
    goToSlide((currentSlide + 1) % slides.length);
  }

  function startAutoSlide() {
    clearInterval(slideTimer);
    slideTimer = setInterval(nextSlide, SLIDE_DURATION);
  }

  // Init carousel
  if (slides.length > 0) {
    // Primeiro slide: reveal diagonal + ativo
    slides[0].classList.add('transition-diagonal', 'active');
    activateIndicator(0);
    startAutoSlide();

    // Click nos indicadores
    indicatorsContainer.addEventListener('click', (e) => {
      const dot = e.target.closest('.hero-indicator');
      if (!dot) return;
      const dots = [...indicatorsContainer.querySelectorAll('.hero-indicator')];
      const idx = dots.indexOf(dot);
      if (idx === -1 || idx === currentSlide) return;
      goToSlide(idx);
      startAutoSlide();
    });
  }

  /* --- Hero Glass Entrance Animation --- */
  const heroGlass = document.querySelector('.hero-glass');
  if (heroGlass) {
    setTimeout(() => heroGlass.classList.add('animated'), 200);
  }

  /* --- GSAP ScrollTrigger Animations --- */
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);

    gsap.utils.toArray('.reveal').forEach(el => {
      gsap.from(el, {
        y: 50, scale: 0.95, opacity: 0, duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none none' }
      });
    });

    gsap.utils.toArray('.reveal-left').forEach(el => {
      gsap.from(el, {
        x: -70, scale: 0.95, opacity: 0, duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 85%', toggleActions: 'play none none none' }
      });
    });
  } else {
    const revealEls = document.querySelectorAll('.reveal, .reveal-left');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealEls.forEach(el => observer.observe(el));
  }

  /* --- Parallax suave no Hero (tilt via mouse) --- */
  const hero = document.querySelector('.hero');
  if (hero && window.innerWidth > 992) {
    hero.addEventListener('mousemove', (e) => {
      const rect = hero.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      const activeImg = hero.querySelector('.hero-bg-slide.active img');
      if (activeImg) {
        activeImg.style.transform = `scale(1.06) translate(${x * -12}px, ${y * -12}px)`;
      }
    });
  }

  /* --- Mural Interativo Removido --- */

  /* --- Services Fullscreen Carousel --- */
  const servBgs = document.querySelectorAll('.serv-bg');
  const servDescs = document.querySelectorAll('.serv-desc-slide');
  const servCards = document.querySelectorAll('.serv-carousel-card');
  const servDots = document.querySelectorAll('.serv-dot');
  const servPrev = document.getElementById('servPrev');
  const servNext = document.getElementById('servNext');
  let servCurrent = 0;
  const servTotal = servCards.length;
  let servAutoTimer = null;

  function updateServCarousel(index) {
    // Background
    servBgs.forEach((bg, i) => bg.classList.toggle('active', i === index));
    // Descrição esquerda
    servDescs.forEach((d, i) => d.classList.toggle('active', i === index));
    // Card direita
    servCards.forEach((c, i) => {
      c.classList.remove('active', 'exiting');
      if (i === index) c.classList.add('active');
    });
    // Dots
    servDots.forEach((dot, i) => dot.classList.toggle('active', i === index));

    servCurrent = index;
  }

  function servNextSlide() {
    updateServCarousel((servCurrent + 1) % servTotal);
  }

  function startServAuto() {
    clearInterval(servAutoTimer);
    servAutoTimer = setInterval(servNextSlide, 8000);
  }

  if (servCards.length > 0) {
    updateServCarousel(0);
    startServAuto();

    servNext?.addEventListener('click', () => {
      updateServCarousel((servCurrent + 1) % servTotal);
      startServAuto();
    });

    servPrev?.addEventListener('click', () => {
      updateServCarousel((servCurrent - 1 + servTotal) % servTotal);
      startServAuto();
    });

    servDots.forEach((dot, i) => {
      dot.addEventListener('click', () => {
        updateServCarousel(i);
        startServAuto();
      });
    });
  }

});
