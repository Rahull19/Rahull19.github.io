/* Rahul Potti — portfolio interactions. No dependencies. */
(() => {
  "use strict";

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Sticky nav background ---------- */
  const nav = $(".nav");
  const onScroll = () => nav && nav.classList.toggle("is-scrolled", window.scrollY > 8);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---------- Mobile menu ---------- */
  const toggle = $(".nav-toggle");
  const menu = $("#mobile-menu");

  const setMenu = (open) => {
    if (!toggle || !menu) return;
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    menu.classList.toggle("is-open", open);
  };

  if (toggle && menu) {
    toggle.addEventListener("click", () => setMenu(toggle.getAttribute("aria-expanded") !== "true"));
    $$("a", menu).forEach((a) => a.addEventListener("click", () => setMenu(false)));
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && menu.classList.contains("is-open")) {
        setMenu(false);
        toggle.focus();
      }
    });
    window.matchMedia("(min-width: 960px)").addEventListener("change", (e) => e.matches && setMenu(false));
  }

  /* ---------- Active section in navigation ---------- */
  const navLinks = $$('.nav-links a, .mobile-menu a[href^="#"]');
  const sections = $$("main section[id]");

  if ("IntersectionObserver" in window && sections.length) {
    const visible = new Map();
    const spy = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => visible.set(entry.target.id, entry.isIntersecting));
        const current = sections.find((s) => visible.get(s.id));
        navLinks.forEach((a) => {
          const active = current && a.getAttribute("href") === `#${current.id}`;
          a.classList.toggle("is-active", Boolean(active));
          if (active) a.setAttribute("aria-current", "true");
          else a.removeAttribute("aria-current");
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    sections.forEach((s) => spy.observe(s));
  }

  /* ---------- Gentle, one-time reveal ---------- */
  const reveals = $$(".reveal");
  if (!reduceMotion && "IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            obs.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add("is-in"));
  }

  /* ---------- Case-study dialog ---------- */
  const dialog = $("#case-dialog");
  const body = $("#case-body");
  let lastTrigger = null;

  const openCase = (id, trigger) => {
    const card = $(`[data-case="${id}"]`);
    const source = card && $(".case-study", card);
    if (!dialog || !source || typeof dialog.showModal !== "function") return;

    $("#case-org").textContent = $(".project-org", card)?.textContent.trim() || "";
    $("#case-title").textContent = $("h3", card)?.textContent.trim() || "";
    $("#case-kind").textContent = $(".project-kind", card)?.textContent.trim() || "";
    body.innerHTML = source.innerHTML;
    body.scrollTop = 0;

    lastTrigger = trigger || null;
    dialog.showModal();
    document.documentElement.classList.add("modal-open");
    if (history.replaceState) history.replaceState(null, "", `#case-${id}`);
  };

  const closeCase = () => dialog && dialog.open && dialog.close();

  $$("[data-open]").forEach((btn) =>
    btn.addEventListener("click", () => openCase(btn.dataset.open, btn))
  );

  if (dialog) {
    $("[data-close]", dialog)?.addEventListener("click", closeCase);
    // Close when the backdrop (outside the panel) is clicked.
    dialog.addEventListener("click", (e) => {
      const r = dialog.getBoundingClientRect();
      const outside = e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom;
      if (outside) closeCase();
    });
    dialog.addEventListener("close", () => {
      document.documentElement.classList.remove("modal-open");
      if (history.replaceState && location.hash.startsWith("#case-")) {
        history.replaceState(null, "", "#projects");
      }
      lastTrigger?.focus({ preventScroll: true });
    });
  }

  // Deep link: /#case-alertlens opens that case study.
  const deep = location.hash.match(/^#case-([\w-]+)$/);
  if (deep) {
    const trigger = $(`[data-open="${deep[1]}"]`);
    if (trigger) {
      $("#projects")?.scrollIntoView();
      openCase(deep[1], trigger);
    }
  }

  /* ---------- Copy email ---------- */
  $$("[data-copy]").forEach((btn) => {
    const label = $("span", btn);
    const original = label ? label.textContent : "";
    btn.addEventListener("click", async () => {
      const text = btn.dataset.copy;
      let ok = false;
      try {
        await navigator.clipboard.writeText(text);
        ok = true;
      } catch {
        // Fallback for browsers without the async clipboard API.
        const ta = document.createElement("textarea");
        ta.value = text;
        ta.setAttribute("readonly", "");
        ta.style.position = "fixed";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.select();
        try {
          ok = document.execCommand("copy");
        } catch {
          ok = false;
        }
        ta.remove();
      }
      if (label) label.textContent = ok ? "Copied" : "Copy failed";
      btn.classList.toggle("is-done", ok);
      setTimeout(() => {
        if (label) label.textContent = original;
        btn.classList.remove("is-done");
      }, 2000);
    });
  });

  /* ---------- Footer year ---------- */
  $$("[data-year]").forEach((el) => (el.textContent = String(new Date().getFullYear())));
})();
