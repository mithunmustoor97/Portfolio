/* Case study interactions - powered by Motion (https://motion.dev) */
(function () {
  const { animate, inView, stagger, hover, scroll } = window.Motion || {};

  const nav = document.querySelector(".cs-nav");
  const toggle = document.querySelector(".cs-nav-toggle");
  const links = document.querySelector(".cs-nav .links");
  const progress = document.querySelector(".cs-progress");

  if (nav) {
    const onScroll = () => nav.classList.toggle("scrolled", window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  if (toggle && links) {
    toggle.addEventListener("click", () => {
      links.classList.toggle("open");
      toggle.setAttribute("aria-expanded", links.classList.contains("open"));
    });
    links.querySelectorAll("a").forEach((a) =>
      a.addEventListener("click", () => links.classList.remove("open"))
    );
  }

  // Reading progress bar (Motion scroll when available)
  if (progress) {
    if (scroll && animate) {
      scroll(
        animate(progress, { scaleX: [0, 1] }, { ease: "linear" }),
        { offset: ["start start", "end end"] }
      );
      progress.style.transformOrigin = "0% 50%";
      progress.style.width = "100%";
      progress.style.scale = "0 1";
    } else {
      const update = () => {
        const h = document.documentElement.scrollHeight - window.innerHeight;
        progress.style.width = (h > 0 ? (window.scrollY / h) * 100 : 0) + "%";
      };
      window.addEventListener("scroll", update, { passive: true });
      update();
    }
  }

  // Scroll-triggered reveals with Motion
  const reveals = document.querySelectorAll(".cs-reveal");
  if (animate && inView) {
    reveals.forEach((el) => {
      el.style.opacity = "0";
      el.style.transform = "translateY(28px)";
    });

    // Hero stagger first
    const heroEls = Array.from(document.querySelectorAll(".cs-hero .cs-reveal"));
    const heroSet = new Set(heroEls);
    if (heroEls.length) {
      animate(
        heroEls,
        { opacity: 1, y: 0 },
        { delay: stagger(0.07, { startDelay: 0.05 }), duration: 0.65, ease: [0.22, 1, 0.36, 1] }
      );
      heroEls.forEach((el) => el.classList.add("in"));
    }

    inView(
      ".cs-reveal",
      (element) => {
        if (heroSet.has(element) || element.classList.contains("in")) return;
        element.classList.add("in");
        animate(
          element,
          { opacity: 1, y: 0 },
          { duration: 0.75, ease: [0.22, 1, 0.36, 1] }
        );
      },
      { margin: "0px 0px -48px 0px", amount: 0.12 }
    );

    // Media cards cascade when section enters
    inView(
      ".cs-media-stack",
      (stack) => {
        const items = stack.querySelectorAll(".cs-media");
        if (!items.length) return;
        items.forEach((el) => {
          el.style.opacity = "0";
          el.style.transform = "translateY(20px)";
        });
        animate(
          items,
          { opacity: 1, y: 0 },
          { delay: stagger(0.1), duration: 0.6, ease: [0.22, 1, 0.36, 1] }
        );
      },
      { margin: "0px 0px -60px 0px", amount: 0.1 }
    );

    // Hover springs on cards / badges
    hover(".cs-card, .cs-metric, .cs-persona, .cs-apps .badges a", (el) => {
      animate(el, { y: -4, scale: 1.01 }, { type: "spring", stiffness: 380, damping: 24 });
      return () =>
        animate(el, { y: 0, scale: 1 }, { type: "spring", stiffness: 380, damping: 28 });
    });
  } else {
    reveals.forEach((el) => el.classList.add("in"));
  }

  // Lightbox
  const medias = document.querySelectorAll(".cs-media, .cs-cover");
  let lb = document.querySelector(".cs-lightbox");
  if (!lb) {
    lb = document.createElement("div");
    lb.className = "cs-lightbox";
    lb.innerHTML = '<button class="close" aria-label="Close">×</button><img alt="" />';
    document.body.appendChild(lb);
  }
  const lbImg = lb.querySelector("img");
  const lbClose = lb.querySelector(".close");

  const openLb = (src, alt) => {
    lbImg.src = src;
    lbImg.alt = alt || "";
    lb.classList.add("open");
    document.body.style.overflow = "hidden";
    if (animate) {
      lb.style.opacity = "0";
      animate(lb, { opacity: 1 }, { duration: 0.25 });
      lbImg.style.transform = "scale(0.94)";
      animate(lbImg, { scale: 1 }, { type: "spring", stiffness: 280, damping: 24 });
    }
  };
  const closeLb = () => {
    const done = () => {
      lb.classList.remove("open");
      document.body.style.overflow = "";
      lbImg.src = "";
    };
    if (animate) {
      animate(lb, { opacity: 0 }, { duration: 0.2 }).finished.then(done);
    } else {
      done();
    }
  };

  medias.forEach((el) => {
    el.addEventListener("click", () => {
      const img = el.querySelector("img");
      if (img) openLb(img.currentSrc || img.src, img.alt);
    });
  });
  lb.addEventListener("click", (e) => {
    if (e.target === lb || e.target === lbClose) closeLb();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeLb();
  });
  if (lbClose) lbClose.addEventListener("click", closeLb);

  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const id = a.getAttribute("href");
      if (id.length > 1) {
        const t = document.querySelector(id);
        if (t) {
          e.preventDefault();
          t.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }
    });
  });
})();
