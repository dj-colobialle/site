/**
 * DJ Colobialle — Main JS
 * Libs: Lenis (smooth scroll), AOS (animations), GLightbox (gallery)
 */

(function () {
  "use strict";

  /* ─────────────────────────────────────────
   * Lenis — Smooth Scroll
   * ───────────────────────────────────────── */
  let lenis;

  function initLenis() {
    // Only init on non-touch / desktop — avoids fighting with native mobile scroll
    lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothTouch: false,
      touchMultiplier: 2,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
  }

  /* ─────────────────────────────────────────
   * Smooth anchor scroll (via Lenis or native)
   * ───────────────────────────────────────── */
  function initAnchorScroll() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", function (e) {
        const href = this.getAttribute("href");
        // Skip bare "#" (scroll-top button handled separately)
        if (!href || href === "#") return;
        const target = document.querySelector(href);
        if (!target) return;
        e.preventDefault();
        // Close mobile nav first if open
        if (document.body.classList.contains("mobile-nav-active")) {
          closeMobileNav();
        }
        if (lenis) {
          lenis.scrollTo(target, { offset: -80, duration: 1.3 });
        } else {
          const top = target.getBoundingClientRect().top + window.scrollY - 80;
          window.scrollTo({ top, behavior: "smooth" });
        }
      });
    });
  }

  /* ─────────────────────────────────────────
   * AOS — Animate on Scroll
   * ───────────────────────────────────────── */
  function initAOS() {
    AOS.init({
      duration: 650,
      easing: "ease-out-quad",
      once: true,
      offset: 50,
      disable: false,
    });
  }

  /* ─────────────────────────────────────────
   * Preloader
   * ───────────────────────────────────────── */
  function initPreloader() {
    const preloader = document.querySelector("#preloader");
    if (!preloader) return;
    window.addEventListener("load", () => {
      setTimeout(() => {
        preloader.classList.add("hidden");
        setTimeout(() => preloader.remove(), 700);
      }, 300);
    });
  }

  /* ─────────────────────────────────────────
   * Header scroll state
   * ───────────────────────────────────────── */
  function initHeaderScroll() {
    function update() {
      document.body.classList.toggle("scrolled", window.scrollY > 80);
    }
    window.addEventListener("scroll", update, { passive: true });
    update();
  }

  /* ─────────────────────────────────────────
   * Mobile nav toggle
   * ───────────────────────────────────────── */
  function closeMobileNav() {
    document.body.classList.remove("mobile-nav-active");
    const btn = document.querySelector(".mobile-nav-toggle");
    if (btn) {
      btn.classList.add("bi-list");
      btn.classList.remove("bi-x");
      btn.setAttribute("aria-expanded", "false");
      btn.setAttribute("aria-label", "Abrir menu");
    }
    // Re-enable Lenis scroll
    if (lenis) lenis.start();
  }

  function openMobileNav() {
    document.body.classList.add("mobile-nav-active");
    const btn = document.querySelector(".mobile-nav-toggle");
    if (btn) {
      btn.classList.remove("bi-list");
      btn.classList.add("bi-x");
      btn.setAttribute("aria-expanded", "true");
      btn.setAttribute("aria-label", "Fechar menu");
    }
    // Pause Lenis while nav is open so body scroll lock works
    if (lenis) lenis.stop();
  }

  function initMobileNav() {
    const btn = document.querySelector(".mobile-nav-toggle");
    if (!btn) return;

    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      if (document.body.classList.contains("mobile-nav-active")) {
        closeMobileNav();
      } else {
        openMobileNav();
      }
    });

    // Close when clicking the backdrop (the ::before pseudo-element area)
    document.addEventListener("click", (e) => {
      if (!document.body.classList.contains("mobile-nav-active")) return;
      const nav = document.querySelector("#navmenu");
      const toggle = document.querySelector(".mobile-nav-toggle");
      if (nav && !nav.contains(e.target) && !toggle.contains(e.target)) {
        closeMobileNav();
      }
    });

    // Close on Escape key
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && document.body.classList.contains("mobile-nav-active")) {
        closeMobileNav();
      }
    });
  }

  /* ─────────────────────────────────────────
   * Scroll Top button
   * ───────────────────────────────────────── */
  function initScrollTop() {
    const btn = document.querySelector(".scroll-top");
    if (!btn) return;

    function toggle() {
      btn.classList.toggle("active", window.scrollY > 200);
    }

    btn.addEventListener("click", (e) => {
      e.preventDefault();
      if (lenis) {
        lenis.scrollTo(0, { duration: 1.3 });
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    });

    window.addEventListener("scroll", toggle, { passive: true });
    toggle();
  }

  /* ─────────────────────────────────────────
   * Navmenu Scrollspy
   * ───────────────────────────────────────── */
  function initScrollspy() {
    const links = document.querySelectorAll(".navmenu a[href^='#']");

    function update() {
      const pos = window.scrollY + 120;
      let activeSet = false;

      // Walk sections in reverse so the topmost visible wins
      const sections = [...links]
        .map((l) => document.querySelector(l.hash))
        .filter(Boolean);

      links.forEach((link) => link.classList.remove("active"));

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (pos >= section.offsetTop) {
          const matchingLink = document.querySelector(
            `.navmenu a[href="#${section.id}"]`
          );
          if (matchingLink) matchingLink.classList.add("active");
          activeSet = true;
          break;
        }
      }

      // Fallback: mark first link active when at top
      if (!activeSet && links.length) links[0].classList.add("active");
    }

    window.addEventListener("scroll", update, { passive: true });
    update();
  }

  /* ─────────────────────────────────────────
   * GLightbox — Gallery
   * ───────────────────────────────────────── */
  function initGallery() {
    if (typeof GLightbox !== "undefined") {
      GLightbox({
        selector: ".glightbox",
        touchNavigation: true,
        loop: true,
        zoomable: true,
      });
    }
  }

  /* ─────────────────────────────────────────
   * Hero Particles (canvas)
   * ───────────────────────────────────────── */
  function initParticles() {
    const container = document.getElementById("hero-particles");
    if (!container) return;

    const canvas = document.createElement("canvas");
    container.appendChild(canvas);
    const ctx = canvas.getContext("2d");

    let W, H, particles = [], animId;
    const COUNT = 50;

    function resize() {
      W = canvas.width = container.offsetWidth;
      H = canvas.height = container.offsetHeight;
    }

    function createParticle() {
      return {
        x: Math.random() * W,
        y: Math.random() * H,
        r: Math.random() * 1.6 + 0.3,
        dx: (Math.random() - 0.5) * 0.3,
        dy: (Math.random() - 0.5) * 0.3,
        alpha: Math.random() * 0.45 + 0.08,
      };
    }

    function draw() {
      ctx.clearRect(0, 0, W, H);
      particles.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(1, 122, 187, ${p.alpha})`;
        ctx.fill();
        p.x += p.dx;
        p.y += p.dy;
        if (p.x < 0 || p.x > W) p.dx *= -1;
        if (p.y < 0 || p.y > H) p.dy *= -1;
      });
      animId = requestAnimationFrame(draw);
    }

    let resizeTimer;
    window.addEventListener("resize", () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(resize, 150);
    });

    resize();
    particles = Array.from({ length: COUNT }, createParticle);
    draw();
  }

  /* ─────────────────────────────────────────
   * Boot
   * ───────────────────────────────────────── */
  document.addEventListener("DOMContentLoaded", () => {
    initPreloader();
    initLenis();
    initAOS();
    initHeaderScroll();
    initMobileNav();
    initAnchorScroll();
    initScrollTop();
    initScrollspy();
    initGallery();
    initParticles();
  });
})();
