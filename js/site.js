/* Awwwards-level interactions - Motion (motion.dev) */
(function () {
  const Motion = window.Motion || {};
  const { animate, inView, stagger, hover, scroll } = Motion;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Loader ---------- */
  const loader = document.querySelector(".loader");
  window.addEventListener("load", () => {
    document.body.classList.remove("is-loading");
    if (loader) {
      if (animate && !reduced) {
        animate(loader, { opacity: 0 }, { duration: 0.55, ease: [0.22, 1, 0.36, 1] }).finished.then(() => {
          loader.classList.add("done");
        });
      } else {
        loader.classList.add("done");
      }
    }
  });
  // Safety: hide loader even if load already fired
  setTimeout(() => {
    document.body.classList.remove("is-loading");
    if (loader) loader.classList.add("done");
  }, 1800);

  /* ---------- Progress ---------- */
  const progress = document.querySelector(".progress");
  if (progress && scroll && animate && !reduced) {
    progress.style.transformOrigin = "0% 50%";
    scroll(animate(progress, { scaleX: [0, 1] }, { ease: "linear" }), {
      offset: ["start start", "end end"],
    });
  } else if (progress) {
    const tick = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.transform = `scaleX(${h > 0 ? window.scrollY / h : 0})`;
    };
    window.addEventListener("scroll", tick, { passive: true });
    tick();
  }

  /* ---------- Nav ---------- */
  const nav = document.querySelector(".nav");
  const toggle = document.querySelector(".nav-toggle");
  const links = document.querySelector(".nav-links");
  if (nav) {
    const onScroll = () => nav.classList.toggle("scrolled", window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }
  if (toggle && links) {
    toggle.addEventListener("click", () => {
      const open = links.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open);
    });
    links.querySelectorAll("a").forEach((a) =>
      a.addEventListener("click", () => links.classList.remove("open"))
    );
  }

  /* ---------- Custom cursor ---------- */
  const isFine = window.matchMedia("(pointer: fine)").matches;
  if (isFine && !reduced) {
    const dot = document.querySelector(".cursor");
    const ring = document.querySelector(".cursor-ring");
    if (dot && ring) {
      document.body.classList.add("has-cursor");
      let x = 0, y = 0, rx = 0, ry = 0;
      window.addEventListener(
        "pointermove",
        (e) => {
          x = e.clientX;
          y = e.clientY;
          dot.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;
        },
        { passive: true }
      );
      const loop = () => {
        rx += (x - rx) * 0.18;
        ry += (y - ry) * 0.18;
        ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
        requestAnimationFrame(loop);
      };
      loop();

      document.querySelectorAll("a, button, .btn, .work-card, .stack-card").forEach((el) => {
        el.addEventListener("mouseenter", () => document.body.classList.add("cursor-hover"));
        el.addEventListener("mouseleave", () => document.body.classList.remove("cursor-hover"));
      });
      document.querySelectorAll(".work-media, .hero-frame, .hero-bg, .about-media, .cs-media, .cs-cover").forEach((el) => {
        el.addEventListener("mouseenter", () => document.body.classList.add("cursor-media"));
        el.addEventListener("mouseleave", () => document.body.classList.remove("cursor-media"));
      });
    }
  }

  /* ---------- Reveals ---------- */
  if (!animate || !inView || reduced) {
    document.querySelectorAll(".reveal").forEach((el) => {
      el.style.opacity = "1";
      el.style.transform = "none";
    });
  } else {
    const heroEls = Array.from(
      document.querySelectorAll(
        "[data-hero-animate] .reveal, .hero .reveal, .hero-v2 .reveal, .hero-v2 [class*='hero-']"
      )
    ).filter((el, i, arr) => arr.indexOf(el) === i);
    // Prefer explicit .reveal nodes inside hero-v2
    const heroReveals = Array.from(document.querySelectorAll(".hero-v2 .reveal, [data-hero-animate] .reveal, .hero .reveal"));
    const heroSet = new Set(heroReveals.length ? heroReveals : heroEls);

    document.querySelectorAll(".reveal").forEach((el) => {
      el.style.opacity = "0";
      el.style.transform = "translateY(28px)";
    });

    const heroAnim = heroReveals.length ? heroReveals : heroEls;
    if (heroAnim.length) {
      animate(
        heroAnim,
        { opacity: 1, y: 0 },
        { delay: stagger(0.07, { startDelay: 0.15 }), duration: 0.8, ease: [0.22, 1, 0.36, 1] }
      );
    }

    inView(
      ".reveal",
      (el) => {
        if (heroSet.has(el)) return;
        animate(el, { opacity: 1, y: 0 }, { duration: 0.75, ease: [0.22, 1, 0.36, 1] });
      },
      { margin: "0px 0px -50px 0px", amount: 0.12 }
    );

    // Stagger work cards media when list enters
    inView(
      ".work-list",
      (list) => {
        const cards = list.querySelectorAll(".work-card");
        cards.forEach((c, i) => {
          const media = c.querySelector(".work-media");
          if (!media) return;
          media.style.opacity = "0";
          media.style.transform = "translateY(24px)";
          animate(
            media,
            { opacity: 1, y: 0 },
            { delay: 0.08 * i, duration: 0.7, ease: [0.22, 1, 0.36, 1] }
          );
        });
      },
      { amount: 0.1 }
    );

    hover(".work-card, .think-card, .stack-card, .stat, .btn", (el) => {
      animate(el, { y: -3 }, { type: "spring", stiffness: 380, damping: 26 });
      return () => animate(el, { y: 0 }, { type: "spring", stiffness: 380, damping: 28 });
    });

    // Subtle parallax on hero background image
    const heroImg = document.querySelector(".hero-bg img, .hero-frame img, .hero-frame-wrap img");
    const heroSec = document.querySelector(".hero, .hero-aww, .hero-v2");
    if (heroImg && heroSec && scroll) {
      scroll(animate(heroImg, { y: [0, 80], scale: [1, 1.08] }, { ease: "linear" }), {
        target: heroSec,
        offset: ["start start", "end start"],
      });
    }

    // Work media entrance
    inView(
      ".work-featured, .work-row",
      (el) => {
        const media = el.querySelector(".wf-media, .wr-media");
        if (!media) return;
        media.style.opacity = "0";
        media.style.transform = "translateY(20px)";
        animate(media, { opacity: 1, y: 0 }, { duration: 0.7, ease: [0.22, 1, 0.36, 1] });
      },
      { amount: 0.15 }
    );
  }

  /* ---------- Magnetic buttons (desktop) ---------- */
  if (isFine && !reduced && animate) {
    document.querySelectorAll("[data-magnetic]").forEach((btn) => {
      btn.addEventListener("pointermove", (e) => {
        const r = btn.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width / 2);
        const dy = e.clientY - (r.top + r.height / 2);
        animate(btn, { x: dx * 0.2, y: dy * 0.2 }, { type: "spring", stiffness: 280, damping: 18, mass: 0.4 });
      });
      btn.addEventListener("pointerleave", () => {
        animate(btn, { x: 0, y: 0 }, { type: "spring", stiffness: 300, damping: 20 });
      });
    });
  }
})();
