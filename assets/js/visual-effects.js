document.addEventListener("DOMContentLoaded", () => {
  // sessionStorage flag is absent on the very first page load in a tab (external entry).
  // Every page sets it, so any subsequent in-site navigation sees it as truthy.
  const VISITED_KEY = "site_visited";
  const isInternalNav = sessionStorage.getItem(VISITED_KEY) === "1";
  sessionStorage.setItem(VISITED_KEY, "1");

  const aboutPage = document.getElementById("about-page");
  const tw = document.querySelector(".typewriter");

  if (aboutPage) {
    if (isInternalNav) {
      // Came from within the site — skip all animations, reveal instantly
      aboutPage.classList.add("no-anim", "revealed");
      if (tw) {
        const text = tw.textContent.trim();
        tw.textContent = text;
        tw.classList.add("typewriter--active", "typewriter--done");
      }
    } else {
      // External entry — run typewriter then reveal the rest
      if (tw) {
        const text = tw.textContent.trim();
        tw.textContent = "";
        tw.classList.add("typewriter--active");
        let i = 0;
        const timer = setInterval(() => {
          tw.textContent += text[i++];
          if (i >= text.length) {
            clearInterval(timer);
            tw.classList.add("typewriter--done");
            setTimeout(() => aboutPage.classList.add("revealed"), 150);
          }
        }, 55);
      } else {
        // No typewriter — just reveal after a short pause
        setTimeout(() => aboutPage.classList.add("revealed"), 400);
      }
    }
  } else if (tw) {
    // Typewriter on a non-about page (no reveal logic needed)
    const text = tw.textContent.trim();
    tw.textContent = "";
    tw.classList.add("typewriter--active");
    let i = 0;
    const timer = setInterval(() => {
      tw.textContent += text[i++];
      if (i >= text.length) {
        clearInterval(timer);
        tw.classList.add("typewriter--done");
      }
    }, 55);
  }

  // ── Email copy-to-clipboard ─────────────────────────────────
  const emailLink = document.querySelector('a[href^="mailto:"]');
  if (emailLink) {
    const email = emailLink.href.replace("mailto:", "");
    emailLink.addEventListener("click", (e) => {
      e.preventDefault();
      navigator.clipboard.writeText(email).then(() => {
        let toast = document.getElementById("email-toast");
        if (!toast) {
          toast = document.createElement("div");
          toast.id = "email-toast";
          document.body.appendChild(toast);
        }
        toast.textContent = `${email} copied to clipboard`;
        toast.classList.add("show");
        clearTimeout(toast._hideTimer);
        toast._hideTimer = setTimeout(() => toast.classList.remove("show"), 2500);
      });
    });
  }

  // ── Scroll fade-in ──────────────────────────────────────────
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("fade-in--visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: "0px 0px -40px 0px" },
  );

  const targets = [
    ...document.querySelectorAll(".publications h2"),
    ...document.querySelectorAll("ol.bibliography li"),
    ...document.querySelectorAll(".post h2"),
    ...document.querySelectorAll(".news table tr"),
  ];

  targets.forEach((el, i) => {
    el.classList.add("fade-in");
    el.style.transitionDelay = `${(i % 6) * 0.08}s`;
    observer.observe(el);
  });
});
