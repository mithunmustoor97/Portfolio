/* Portfolio interactions - powered by Motion (https://motion.dev) */
(function () {
  const { animate, inView, stagger, hover, scroll } = window.Motion || {};

  // Nav
  const nav = document.querySelector(".site-nav");
  const toggle = document.querySelector(".nav-toggle");
  const links = document.querySelector(".nav-links");

  if (nav) {
    const onScroll = () => nav.classList.toggle("scrolled", window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  if (toggle && links) {
    toggle.addEventListener("click", () => {
      links.classList.toggle("open");
      toggle.setAttribute("aria-expanded", links.classList.contains("open"));
    });
    links.querySelectorAll("a").forEach((a) => {
      a.addEventListener("click", () => links.classList.remove("open"));
    });
  }

  // Fallback if Motion failed to load
  if (!animate || !inView) {
    document.querySelectorAll(".reveal").forEach((el) => el.classList.add("visible"));
    return;
  }

  // Hero content stagger on load (skip these in inView below)
  const heroItems = Array.from(
    document.querySelectorAll(".hero .reveal, .page-hero .reveal")
  );
  const heroSet = new Set(heroItems);

  // Prepare reveal elements
  document.querySelectorAll(".reveal").forEach((el) => {
    el.style.opacity = "0";
    el.style.transform = "translateY(24px)";
  });

  if (heroItems.length) {
    animate(
      heroItems,
      { opacity: 1, y: 0 },
      { delay: stagger(0.08, { startDelay: 0.1 }), duration: 0.65, ease: [0.22, 1, 0.36, 1] }
    );
    heroItems.forEach((el) => el.classList.add("visible"));
  }

  // Scroll-triggered entrance animations
  inView(
    ".reveal",
    (element) => {
      if (heroSet.has(element) || element.classList.contains("visible")) return;
      element.classList.add("visible");
      animate(
        element,
        { opacity: 1, y: 0 },
        { duration: 0.7, ease: [0.22, 1, 0.36, 1] }
      );
    },
    { margin: "0px 0px -40px 0px", amount: 0.15 }
  );

  // Soft hover lift on case cards / buttons
  hover(".case-card, .btn, .stack-card, .stat-card", (el) => {
    animate(el, { y: -3 }, { type: "spring", stiffness: 400, damping: 25 });
    return () => animate(el, { y: 0 }, { type: "spring", stiffness: 400, damping: 28 });
  });

  // Optional: parallax-ish scroll on hero portrait
  const portrait = document.querySelector(".hero-portrait-wrap img");
  if (portrait && scroll) {
    scroll(
      animate(portrait, { y: [0, 40] }, { ease: "linear" }),
      { target: document.querySelector(".hero"), offset: ["start start", "end start"] }
    );
  }
})();
