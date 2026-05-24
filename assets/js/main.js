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
    lenis = new Lenis({
      duration: 1.3,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smooth: true,
      smoothTouch: false,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Anchor links use Lenis scroll
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", function (e) {
        const target = document.querySelector(this.getAttribute("href"));
        if (!target) return;
        e.preventDefault();
        lenis.scrollTo(target, { offset: -90, duration: 1.4 });
      });
    });
  }

  /* ─────────────────────────────────────────
   * AOS — Animate on Scroll
   * ───────────────────────────────────────── */
  function initAOS() {
    AOS.init({
      duration: 700,
      easing: "ease-out-cubic",
      once: true,
      offset: 60,
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
      }, 400);
    });
  }

  /* ─────────────────────────────────────────
   * Header scroll state
   * ───────────────────────────────────────── */
  function initHeaderScroll() {
    const body = document.body;
    const header = document.querySelector("#header");
    if (!header) return;

    function update() {
      window.scrollY > 80
        ? body.classList.add("scrolled")
        : body.classList.remove("scrolled");
    }
    window.addEventListener("scroll", update, { passive: true });
    update();
  }

  /* ─────────────────────────────────────────
   * Mobile nav toggle
   * ───────────────────────────────────────── */
  function initMobileNav() {
    const btn = document.querySelector(".mobile-nav-toggle");
    if (!btn) return;

    function toggle() {
      document.body.classList.toggle("mobile-nav-active");
      btn.classList.toggle("bi-list");
      btn.classList.toggle("bi-x");
    }

    btn.addEventListener("click", toggle);

    document.querySelectorAll("#navmenu a").forEach((link) => {
      link.addEventListener("click", () => {
        if (document.body.classList.contains("mobile-nav-active")) toggle();
      });
    });
  }

  /* ─────────────────────────────────────────
   * Scroll Top button
   * ───────────────────────────────────────── */
  function initScrollTop() {
    const btn = document.querySelector(".scroll-top");
    if (!btn) return;

    function toggle() {
      window.scrollY > 200
        ? btn.classList.add("active")
        : btn.classList.remove("active");
    }

    btn.addEventListener("click", (e) => {
      e.preventDefault();
      if (lenis) {
        lenis.scrollTo(0, { duration: 1.4 });
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
    const links = document.querySelectorAll(".navmenu a");

    function update() {
      const pos = window.scrollY + 150;
      links.forEach((link) => {
        if (!link.hash) return;
        const section = document.querySelector(link.hash);
        if (!section) return;
        const inView =
          pos >= section.offsetTop &&
          pos <= section.offsetTop + section.offsetHeight;
        link.classList.toggle("active", inView);
      });
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

    let W, H, particles = [];
    const COUNT = 55;

    function resize() {
      W = canvas.width = container.offsetWidth;
      H = canvas.height = container.offsetHeight;
    }

    function createParticle() {
      return {
        x: Math.random() * W,
        y: Math.random() * H,
        r: Math.random() * 1.8 + 0.4,
        dx: (Math.random() - 0.5) * 0.35,
        dy: (Math.random() - 0.5) * 0.35,
        alpha: Math.random() * 0.5 + 0.1,
      };
    }

    function init() {
      resize();
      particles = Array.from({ length: COUNT }, createParticle);
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
      requestAnimationFrame(draw);
    }

    window.addEventListener("resize", resize);
    init();
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
    initScrollTop();
    initScrollspy();
    initGallery();
    initParticles();
  });
})();
