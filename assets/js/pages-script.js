/* ============================================
   PAGES-SCRIPT.JS — Script das páginas internas
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* --- Navbar: sempre scrolled nas páginas internas --- */
  const navbar = document.querySelector('.navbar');
  navbar.classList.add('scrolled');
  // Mantém scrolled sempre nas internas (sem efeito float)

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

  /* --- AOS-only approach: no GSAP .from() that hides content --- */
  /* As animações de entrada usam AOS via data-aos nos HTMLs */
  /* Sem gsap.from() que zera opacidade e pode bugar */

});
