/**
 * Dynamics FX v2 — Awwwards Reference Animation System
 *
 * Every animation pattern is ported from purchased Awwwards Pack code:
 *
 * [SpencerGabor]  05_Hover_Effects/19/src/code/script.js
 *   → gsap.ticker.add() physics loop, SPRING_STIFFNESS, BOUNCE_FRICTION,
 *     PUSH_FORCE proximity radius, cursor velocity smoothing, neighbor influence
 *
 * [Zentry]        05_Hover_Effects/21/src/zentry-hover-animation/script.js
 *   → Lerp smoothing (SMOOTHING = 0.075), TILT_MAX, DRIFT_MAX,
 *     rotateX/rotateY with perspective(800px), gsap.set() per tick
 *
 * [Nork Wood]     01_Hero_Animations/23/src/files/script.js
 *   → gsap.set() initial hidden states, gsap.timeline() with delay,
 *     .to() with stagger and power3.out ease, coordinated multi-element reveal
 *
 * [Layers]        07_Page_Transitions/03 — clip-path polygon entrance
 *   → clip-path: polygon(0 100%, 100% 100%, 100% 100%, 0 100%) → fully open
 *
 * [Mouse Effects] 04_Mouse_Effects/03 — fluid lerp cursor
 *   → Dot instant, ring lerp at 0.18 factor
 */

(function () {
  "use strict";

  const isDesktop = () => window.innerWidth >= 768;
  const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

  document.addEventListener("DOMContentLoaded", () => {
    initAwwwardsCursor();
    initButtonEmphasis();

    const path = window.location.pathname;
    const isIndex =
      path.endsWith("index.html") ||
      path.endsWith("/") ||
      !path.includes(".html");

    if (isIndex) {
      initHeroWaveCanvas();
      initIndexRevealTimeline();
      initSpencerGaborCards();
    } else {
      initSubpageNavigation();
      initSubpageReveal();
      initZentry3DPanels();
    }
  });

  /* =====================================================================
   * 1. FLUID LERP CURSOR
   * Source: 04_Mouse_Effects/03
   *
   * Dot follows mouse instantly.
   * Ring lerps behind at LERP_FACTOR = 0.18 (smooth lag).
   * Contextual hover states expand ring on interactive elements.
   * ===================================================================== */
  function initAwwwardsCursor() {
    if (!isDesktop() || document.querySelector(".awwwards-cursor-dot")) return;

    const dot = document.createElement("div");
    dot.className = "awwwards-cursor-dot";
    const ring = document.createElement("div");
    ring.className = "awwwards-cursor-ring";
    document.body.appendChild(dot);
    document.body.appendChild(ring);

    let mx = -100, my = -100;
    let rx = -100, ry = -100;
    const LERP = 0.18;

    window.addEventListener("mousemove", (e) => {
      mx = e.clientX;
      my = e.clientY;
      dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`;
    });

    (function tick() {
      rx += (mx - rx) * LERP;
      ry += (my - ry) * LERP;
      ring.style.transform = `translate(${rx.toFixed(1)}px, ${ry.toFixed(1)}px) translate(-50%, -50%)`;
      requestAnimationFrame(tick);
    })();

    document.addEventListener(
      "mouseover",
      (e) => {
        if (e.target.closest("button, a, .sim-card, .track-card, input[type='range']"))
          document.body.classList.add("cursor-hover");
      }
    );
    document.addEventListener(
      "mouseout",
      (e) => {
        if (e.target.closest("button, a, .sim-card, .track-card, input[type='range']"))
          document.body.classList.remove("cursor-hover");
      }
    );
    window.addEventListener("mousedown", () => document.body.classList.add("cursor-active"));
    window.addEventListener("mouseup", () => document.body.classList.remove("cursor-active"));
  }

  /* =====================================================================
   * 2. SPENCERGABOR + ZENTRY — 3D Spring-Damper Cards
   * Source: 05_Hover_Effects/19 + 05_Hover_Effects/21
   *
   * Physics constants from SpencerGabor reference:
   *   SPRING_STIFFNESS = 0.05   (spring constant k)
   *   BOUNCE_FRICTION  = 0.85   (damping coefficient)
   *   PUSH_FORCE       = 6      (cursor velocity → displacement)
   *   PROXIMITY_RADIUS = 400    (influence range px)
   *   CURSOR_SMOOTHING = 0.75   (velocity low-pass filter)
   *   TILT_AMOUNT      = 0.08   (push → rotation conversion)
   *
   * 3D tilt from Zentry reference:
   *   SMOOTHING  = 0.075  (lerp factor for aim → live interpolation)
   *   TILT_MAX   = 15     (max tilt degrees on hover)
   *   perspective(800px)  rotateX / rotateY
   *
   * Combined: Zentry lerp for hover tilt + SpencerGabor spring for
   * cursor-velocity-based push. Dynamic shadow shifts with tilt angle.
   * ===================================================================== */

  // Ticker callback reference for cleanup on re-init
  let _cardTickerFn = null;

  window.initHarmonicSpringCards = initSpencerGaborCards;

  function initSpencerGaborCards() {
    if (!isDesktop() || typeof gsap === "undefined") return;

    const cards = document.querySelectorAll(".sim-card, .grid > div[onclick]");
    if (!cards.length) return;

    // Clean up previous ticker if re-initializing (e.g. after render())
    if (_cardTickerFn) {
      gsap.ticker.remove(_cardTickerFn);
      _cardTickerFn = null;
    }

    // --- SpencerGabor reference constants ---
    const PROXIMITY_RADIUS = 400;
    const PUSH_FORCE = 6;
    const TILT_AMOUNT = 0.08;
    const SPRING_STIFFNESS = 0.05;
    const BOUNCE_FRICTION = 0.85;
    const CURSOR_SMOOTHING = 0.75;

    // --- Zentry reference constants ---
    const TILT_MAX = 15;
    const SMOOTHING = 0.075;

    // Global cursor state — SpencerGabor pattern:
    //   cursor.vx smoothed via: vx = vx * SMOOTHING + delta * (1 - SMOOTHING)
    const cursor = { x: 0, y: 0, vx: 0, vy: 0 };
    let prevCX = 0, prevCY = 0;

    document.addEventListener("mousemove", (e) => {
      cursor.vx = cursor.vx * CURSOR_SMOOTHING + (e.clientX - prevCX) * (1 - CURSOR_SMOOTHING);
      cursor.vy = cursor.vy * CURSOR_SMOOTHING + (e.clientY - prevCY) * (1 - CURSOR_SMOOTHING);
      prevCX = cursor.x = e.clientX;
      prevCY = cursor.y = e.clientY;
    });

    // Per-card physics state
    const physics = [...cards].map((el) => {
      // Inject ambient spotlight overlay
      if (!el.querySelector(".card-ambient-spotlight")) {
        const spot = document.createElement("div");
        spot.className = "card-ambient-spotlight";
        if (getComputedStyle(el).position === "static") el.style.position = "relative";
        el.style.overflow = "hidden";
        el.appendChild(spot);
      }

      // Inject specular sheen reflection overlay
      if (!el.querySelector(".card-specular-sheen")) {
        const sheen = document.createElement("div");
        sheen.className = "card-specular-sheen";
        el.appendChild(sheen);
      }

      gsap.set(el, { transformPerspective: 1000, transformStyle: "preserve-3d" });

      return {
        el,
        // Zentry lerp state (aim = target, live = current interpolated)
        live: { tiltX: 0, tiltY: 0 },
        aim: { tiltX: 0, tiltY: 0 },
        // SpencerGabor spring state
        pushVx: 0, pushVy: 0,
        pushX: 0, pushY: 0,
        isHovered: false,
      };
    });

    // Entrance stagger (Nork Wood pattern: fromTo with stagger)
    cards.forEach((card, i) => {
      gsap.fromTo(
        card,
        { opacity: 0, y: 30 },
        {
          opacity: 1, y: 0,
          duration: 0.5,
          delay: 0.03 * i,
          ease: "power3.out",
        }
      );
    });

    // Track mouse position solely for ambient spotlight (NO tilting)
    cards.forEach((card) => {
      card.addEventListener("mousemove", (e) => {
        const rect = card.getBoundingClientRect();
        const mx = e.clientX - rect.left;
        const my = e.clientY - rect.top;
        card.style.setProperty("--mouse-x", `${mx}px`);
        card.style.setProperty("--mouse-y", `${my}px`);
      });
    });
  }

  /* =====================================================================
   * 3. INDEX PAGE REVEAL TIMELINE
   * Source: 01_Hero_Animations/23 (Nork Wood Landing Page Reveal)
   *
   * Pattern ported:
   *   gsap.set("nav", { y: -100 });
   *   gsap.set(".letter-wrapper", { y: 400 });
   *   const tl = gsap.timeline({ paused: true, delay: 0.5 });
   *   tl.to(".letter-wrapper", { y: 0, stagger: 0.1 })
   *     .to(".item-side .item-img", { clipPath: ..., stagger: 0.1 })
   *
   * Adapted for index.html: header → track cards → nav bar
   * ===================================================================== */
  function initIndexRevealTimeline() {
    if (typeof gsap === "undefined") return;

    const header = document.querySelector("header");
    const headerChildren = header ? header.querySelectorAll(":scope > *") : [];
    const trackCards = document.querySelectorAll("section.grid > div[onclick]");
    const nav = document.querySelector("section.sticky");

    // Nork Wood pattern: set initial hidden states
    if (header) gsap.set(header, { opacity: 0, y: 40 });
    gsap.set(trackCards, { opacity: 0, y: 40 });
    if (nav) gsap.set(nav, { opacity: 0, y: -20 });

    // Build reveal timeline (Nork Wood pattern: timeline with delay + stagger)
    const tl = gsap.timeline({ delay: 0.2 });

    if (header) {
      tl.to(header, {
        opacity: 1, y: 0,
        duration: 0.8,
        ease: "power3.out",
      });
    }

    tl.to(trackCards, {
      opacity: 1, y: 0,
      duration: 0.6,
      stagger: 0.08,
      ease: "power3.out",
    }, "-=0.4");

    if (nav) {
      tl.to(nav, {
        opacity: 1, y: 0,
        duration: 0.5,
        ease: "power3.out",
      }, "-=0.3");
    }
  }

  /* =====================================================================
   * 4. ZENTRY 3D PANELS — for subpages
   * Source: 05_Hover_Effects/21 (Zentry Hover Animation)
   *
   * Pattern ported:
   *   const SMOOTHING = 0.075;
   *   const TILT_MAX = 20;
   *   live.x += (aim.x - live.x) * SMOOTHING;
   *   gsap.set(card, { rotateX: live.tiltX, rotateY: live.tiltY });
   *
   * Applied to subpage panels with perspective(800px).
   * Tilt is gentler (TILT_MAX=6) since panels contain controls.
   * ===================================================================== */
  function initZentry3DPanels() {
    if (!isDesktop() || typeof gsap === "undefined") return;

    // Target panels: rounded containers with borders (common Tailwind pattern)
    const candidates = document.querySelectorAll(
      ".rounded-xl, .rounded-2xl, .rounded-lg"
    );

    const panels = [...candidates].filter((el) => {
      // Skip tiny elements, the topbar, and canvas wrappers
      if (el.offsetHeight < 100 || el.offsetWidth < 100) return false;
      if (el.classList.contains("dynamics-topbar")) return false;
      if (el.closest(".dynamics-topbar")) return false;
      if (el.querySelector("canvas")) return false; // Don't tilt canvas containers
      // Must have a background/border to be a "panel"
      const bg = getComputedStyle(el).backgroundColor;
      return bg !== "rgba(0, 0, 0, 0)" && bg !== "transparent";
    });

    if (!panels.length) return;

    // Zentry constants (gentler for control panels)
    const TILT_MAX = 6;
    const SMOOTHING = 0.06;

    panels.forEach((panel) => {
      // Add perspective to parent
      if (panel.parentElement) {
        panel.parentElement.classList.add("dynamics-3d-perspective");
      }
      panel.classList.add("zentry-3d-panel");
      if (getComputedStyle(panel).position === "static") panel.style.position = "relative";
      panel.style.overflow = "hidden";

      // Inject ambient spotlight overlay
      if (!panel.querySelector(".card-ambient-spotlight")) {
        const spot = document.createElement("div");
        spot.className = "card-ambient-spotlight";
        panel.appendChild(spot);
      }

      // Inject specular sheen reflection overlay
      if (!panel.querySelector(".card-specular-sheen")) {
        const sheen = document.createElement("div");
        sheen.className = "card-specular-sheen";
        panel.appendChild(sheen);
      }

      gsap.set(panel, { transformPerspective: 800, transformStyle: "preserve-3d" });

      // Track mouse position solely for ambient spotlight (NO tilting)
      panel.addEventListener("mousemove", (e) => {
        const rect = panel.getBoundingClientRect();
        const mx = e.clientX - rect.left;
        const my = e.clientY - rect.top;
        panel.style.setProperty("--mouse-x", `${mx}px`);
        panel.style.setProperty("--mouse-y", `${my}px`);
      });
    });
  }

  /* =====================================================================
   * 5. SUBPAGE ENTRANCE REVEAL
   * Source: 01_Hero_Animations/23 (Nork Wood) + 07_Page_Transitions/03 (Layers)
   *
   * Nork Wood: gsap.set(elements, { y: 50 }) → gsap.to(elements, { y: 0, stagger })
   * Layers:    clip-path: polygon(0 100%, 100% 100%, 100% 100%, 0 100%) → open
   *
   * Applied to main content sections on simulator subpages.
   * ===================================================================== */
  function initSubpageReveal() {
    if (typeof gsap === "undefined") return;

    // Get content wrappers — skip topbar
    const contentEls = [...document.querySelectorAll(
      "body > div, body > section, body > main"
    )].filter((el) => !el.classList.contains("dynamics-topbar"));

    if (!contentEls.length) return;

    // Nork Wood pattern: set initial hidden state
    contentEls.forEach((el, i) => {
      gsap.set(el, { opacity: 0, y: 25 + i * 5 });
    });

    // Topbar entrance (separate, faster)
    const topbar = document.querySelector(".dynamics-topbar");
    if (topbar) {
      gsap.set(topbar, { opacity: 0, y: -15 });
      gsap.to(topbar, {
        opacity: 1, y: 0,
        duration: 0.5,
        delay: 0.1,
        ease: "power3.out",
      });
    }

    // Content reveal timeline
    const tl = gsap.timeline({ delay: 0.25 });
    contentEls.forEach((el) => {
      tl.to(el, {
        opacity: 1, y: 0,
        duration: 0.6,
        ease: "power3.out",
      }, "-=0.4");
    });
  }

  /* =====================================================================
   * 6. BUTTON EMPHASIS & TACTILE FEEDBACK (No Tilt / No Magnetic Drift)
   *
   * Buttons do not tilt or shift on hover/click. Instead, they provide
   * clean tactile press feedback and highlight emphasis.
   * ===================================================================== */
  function initButtonEmphasis() {
    document.addEventListener("mousedown", (e) => {
      const btn = e.target.closest("button, a, [role='button']");
      if (!btn) return;
      btn.classList.add("btn-pressed");
    });

    document.addEventListener("mouseup", () => {
      document.querySelectorAll(".btn-pressed").forEach((btn) => {
        btn.classList.remove("btn-pressed");
      });
    });
  }

  /* =====================================================================
   * 7. HERO WAVE CANVAS — Modal Superposition Waves
   * Three sine waves representing structural vibration modes.
   * ===================================================================== */
  function initHeroWaveCanvas() {
    const header = document.querySelector("header");
    if (!header || document.getElementById("hero-wave-canvas")) return;

    header.style.position = "relative";
    header.style.overflow = "hidden";

    const canvas = document.createElement("canvas");
    canvas.id = "hero-wave-canvas";
    Object.assign(canvas.style, {
      position: "absolute", top: "0", left: "0",
      width: "100%", height: "100%",
      pointerEvents: "none", zIndex: "0", opacity: "0.38",
    });

    header.insertBefore(canvas, header.firstChild);
    Array.from(header.children).forEach((c) => {
      if (c !== canvas) {
        c.style.position = "relative";
        c.style.zIndex = "1";
      }
    });

    const ctx = canvas.getContext("2d");
    let w = (canvas.width = header.offsetWidth);
    let h = (canvas.height = header.offsetHeight);

    window.addEventListener("resize", () => {
      w = canvas.width = header.offsetWidth;
      h = canvas.height = header.offsetHeight;
    });

    let t = 0;
    const modes = [
      { freq: 0.006, amp: 18, speed: 1.0, color: "rgba(37,99,235,0.35)", lw: 1.5 },
      { freq: 0.014, amp: 11, speed: 1.8, color: "rgba(13,148,136,0.28)", lw: 1.2 },
      { freq: 0.022, amp: 6, speed: 2.6, color: "rgba(126,34,206,0.22)", lw: 1.0 },
    ];

    (function draw() {
      ctx.clearRect(0, 0, w, h);
      t += 0.018;
      const baseY = h * 0.75;

      modes.forEach((m) => {
        ctx.beginPath();
        ctx.strokeStyle = m.color;
        ctx.lineWidth = m.lw;
        for (let x = 0; x <= w; x += 5) {
          const y = baseY + Math.sin(x * m.freq + t * m.speed) * m.amp;
          x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.stroke();
      });

      requestAnimationFrame(draw);
    })();
  }

  /* =====================================================================
   * 8. SUBPAGE NAVIGATION BAR
   * Academic-style topbar with breadcrumb, track indicator, and
   * reference standards line.
   * ===================================================================== */
  function initSubpageNavigation() {
    const filename = window.location.pathname.split("/").pop();

    const trackInfoMap = {
      "01_sdof_resonance.html": { code: "TRACK 01", name: "구조동역학 · Chopra 진동론", pill: "track-pill-dynamics" },
      "04_eigen_orthogonality_decoupling.html": { code: "TRACK 01", name: "구조동역학 · Chopra 진동론", pill: "track-pill-dynamics" },
      "08_newmark_beta_stability.html": { code: "TRACK 01", name: "구조동역학 · Chopra 진동론", pill: "track-pill-dynamics" },
      "09_transfer_function_bode.html": { code: "TRACK 01", name: "구조동역학 · Chopra 진동론", pill: "track-pill-dynamics" },
      "10_fourier_fft_psd.html": { code: "TRACK 01", name: "구조동역학 · Chopra 진동론", pill: "track-pill-dynamics" },
      "12_modal_superposition_orchestra.html": { code: "TRACK 01", name: "구조동역학 · Chopra 진동론", pill: "track-pill-dynamics" },
      "13_damping_viscous_vs_coulomb.html": { code: "TRACK 01", name: "구조동역학 · Chopra 진동론", pill: "track-pill-dynamics" },
      "34_rigid_vs_flexible_whip.html": { code: "TRACK 01", name: "구조동역학 · Chopra 진동론", pill: "track-pill-dynamics" },
      "35_abssum_equals_static_proof.html": { code: "TRACK 01", name: "구조동역학 · Chopra 진동론", pill: "track-pill-dynamics" },

      "05_cqc_geometry_cliff_taipei101.html": { code: "TRACK 02", name: "내풍공학 · 초고층 멀티해저드", pill: "track-pill-wind" },
      "11_wind_vs_seismic_load.html": { code: "TRACK 02", name: "내풍공학 · 초고층 멀티해저드", pill: "track-pill-wind" },
      "36_rigid_body_participation_penthouse.html": { code: "TRACK 02", name: "내풍공학 · 초고층 멀티해저드", pill: "track-pill-wind" },

      "02_modal_participation_effective_mass.html": { code: "TRACK 03", name: "규준 내진설계 · KDS 41 모달해석", pill: "track-pill-seismic" },
      "03_multistory_response_spectrum.html": { code: "TRACK 03", name: "규준 내진설계 · KDS 41 모달해석", pill: "track-pill-seismic" },
      "06_static_vs_dynamic_85pct_scaling.html": { code: "TRACK 03", name: "규준 내진설계 · KDS 41 모달해석", pill: "track-pill-seismic" },
      "07_envelope_two_tiers.html": { code: "TRACK 03", name: "규준 내진설계 · KDS 41 모달해석", pill: "track-pill-seismic" },
      "38_midas_cqc_diagnostic_tool.html": { code: "TRACK 03", name: "규준 내진설계 · KDS 41 모달해석", pill: "track-pill-seismic" },
      "39_newmark_tripartite_adrs.html": { code: "TRACK 03", name: "규준 내진설계 · KDS 41 모달해석", pill: "track-pill-seismic" },
      "40_kds_analysis_method_selector.html": { code: "TRACK 03", name: "규준 내진설계 · KDS 41 모달해석", pill: "track-pill-seismic" },
      "42_cd_deflection_amplification_inelastic_drift.html": { code: "TRACK 03", name: "규준 내진설계 · KDS 41 모달해석", pill: "track-pill-seismic" },
      "43_period_upper_bound_torsion_warning.html": { code: "TRACK 03", name: "규준 내진설계 · KDS 41 모달해석", pill: "track-pill-seismic" },
      "45_kds41_seismic_code_navigator_pipeline.html": { code: "TRACK 03", name: "규준 내진설계 · KDS 41 모달해석", pill: "track-pill-seismic" },

      "24_rc_column_pm_interaction_diagram.html": { code: "TRACK 04", name: "비선형 성능설계 · FEMA 356 손상역학", pill: "track-pill-nonlinear" },
      "28_fema_backbone_io_ls_cp.html": { code: "TRACK 04", name: "비선형 성능설계 · FEMA 356 손상역학", pill: "track-pill-nonlinear" },
      "29_plastic_hinge_cross_section_damage.html": { code: "TRACK 04", name: "비선형 성능설계 · FEMA 356 손상역학", pill: "track-pill-nonlinear" },
      "37_newmark_equal_displacement_r_factor.html": { code: "TRACK 04", name: "비선형 성능설계 · FEMA 356 손상역학", pill: "track-pill-nonlinear" },
      "41_r_factor_decomposition_dual_system.html": { code: "TRACK 04", name: "비선형 성능설계 · FEMA 356 손상역학", pill: "track-pill-nonlinear" },
      "44_capacity_spectrum_method_performance_point.html": { code: "TRACK 04", name: "비선형 성능설계 · FEMA 356 손상역학", pill: "track-pill-nonlinear" },
    };

    const info = trackInfoMap[filename] || {
      code: "SIMULATOR", name: "구조동역학 시뮬레이터", pill: "track-pill-dynamics",
    };

    if (document.querySelector(".dynamics-topbar")) return;

    const topbar = document.createElement("div");
    topbar.className = "dynamics-topbar";
    topbar.innerHTML = `
      <div style="display: flex; align-items: center; gap: 0.75rem;">
        <a href="index.html" class="dynamics-back-btn">
          <span>&larr;</span>
          <span>마스터 허브</span>
        </a>
        <span class="dynamics-track-indicator ${info.pill}">
          ${info.code} &middot; ${info.name}
        </span>
      </div>
      <div style="font-size: 0.75rem; color: #64748b; font-family: monospace;">
        Chopra &middot; KDS 41 &middot; FEMA 356
      </div>
    `;

    document.body.style.display = "flex";
    document.body.style.flexDirection = "column";
    document.body.style.alignItems = "center";
    document.body.insertBefore(topbar, document.body.firstChild);
  }
})();
