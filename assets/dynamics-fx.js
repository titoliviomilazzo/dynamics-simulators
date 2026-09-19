/**
 * Dynamics FX — Solid Architectural Interaction System
 *
 * Clean, reliable interactions:
 * - Natural OS cursor (no trailing dots/rings)
 * - Coordinated entrance timeline
 * - Tactile button compression feedback
 * - Subtle monochrome wave background
 */

(function () {
  "use strict";

  const isDesktop = () => window.innerWidth >= 768;

  document.addEventListener("DOMContentLoaded", () => {
    initButtonEmphasis();

    const path = window.location.pathname;
    const isIndex =
      path.endsWith("index.html") ||
      path.endsWith("/") ||
      !path.includes(".html");

    if (isIndex) {
      initHeroWaveCanvas();
      initIndexRevealTimeline();
      initEntranceStagger();
    } else {
      initSubpageNavigation();
      initSubpageReveal();
    }
  });

  /* =====================================================================
   * 1. ENTRANCE STAGGER FOR CARDS
   * Clean, subtle upward fade without tilt or rotation.
   * ===================================================================== */
  function initEntranceStagger() {
    if (!isDesktop() || typeof gsap === "undefined") return;

    const cards = document.querySelectorAll(".sim-card, .track-card");
    if (!cards.length) return;

    cards.forEach((card, i) => {
      gsap.fromTo(
        card,
        { opacity: 0, y: 20 },
        {
          opacity: 1, y: 0,
          duration: 0.4,
          delay: 0.02 * i,
          ease: "power2.out",
        }
      );
    });
  }

  /* =====================================================================
   * 2. INDEX REVEAL TIMELINE
   * ===================================================================== */
  function initIndexRevealTimeline() {
    if (typeof gsap === "undefined") return;

    const header = document.querySelector("header");
    const trackCards = document.querySelectorAll("section.grid > div[onclick]");
    const nav = document.querySelector("section.sticky");

    if (header) gsap.set(header, { opacity: 0, y: 25 });
    gsap.set(trackCards, { opacity: 0, y: 25 });
    if (nav) gsap.set(nav, { opacity: 0, y: -15 });

    const tl = gsap.timeline({ delay: 0.1 });

    if (header) {
      tl.to(header, {
        opacity: 1, y: 0,
        duration: 0.6,
        ease: "power2.out",
      });
    }

    tl.to(trackCards, {
      opacity: 1, y: 0,
      duration: 0.5,
      stagger: 0.06,
      ease: "power2.out",
    }, "-=0.3");

    if (nav) {
      tl.to(nav, {
        opacity: 1, y: 0,
        duration: 0.4,
        ease: "power2.out",
      }, "-=0.2");
    }
  }

  /* =====================================================================
   * 3. SUBPAGE ENTRANCE REVEAL
   * ===================================================================== */
  function initSubpageReveal() {
    if (typeof gsap === "undefined") return;

    const contentEls = [...document.querySelectorAll(
      "body > div, body > section, body > main"
    )].filter((el) => !el.classList.contains("dynamics-topbar"));

    if (!contentEls.length) return;

    contentEls.forEach((el, i) => {
      gsap.set(el, { opacity: 0, y: 20 + i * 4 });
    });

    const topbar = document.querySelector(".dynamics-topbar");
    if (topbar) {
      gsap.set(topbar, { opacity: 0, y: -12 });
      gsap.to(topbar, {
        opacity: 1, y: 0,
        duration: 0.4,
        delay: 0.05,
        ease: "power2.out",
      });
    }

    const tl = gsap.timeline({ delay: 0.15 });
    contentEls.forEach((el) => {
      tl.to(el, {
        opacity: 1, y: 0,
        duration: 0.5,
        ease: "power2.out",
      }, "-=0.3");
    });
  }

  /* =====================================================================
   * 4. BUTTON EMPHASIS & TACTILE FEEDBACK
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
   * 5. HERO WAVE CANVAS — Restrained Monochrome Waves
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
      pointerEvents: "none", zIndex: "0", opacity: "0.25",
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
      { freq: 0.006, amp: 16, speed: 1.0, color: "rgba(255,255,255,0.18)", lw: 1.5 },
      { freq: 0.014, amp: 10, speed: 1.6, color: "rgba(255,255,255,0.12)", lw: 1.2 },
      { freq: 0.022, amp: 6, speed: 2.2, color: "rgba(255,255,255,0.08)", lw: 1.0 },
    ];

    (function draw() {
      ctx.clearRect(0, 0, w, h);
      t += 0.015;
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
   * 6. SUBPAGE NAVIGATION BAR
   * ===================================================================== */
  function initSubpageNavigation() {
    const filename = window.location.pathname.split("/").pop();

    const trackInfoMap = {
      "01_sdof_resonance.html": { code: "TRACK 01", name: "구조동역학 · Chopra 진동론" },
      "04_eigen_orthogonality_decoupling.html": { code: "TRACK 01", name: "구조동역학 · Chopra 진동론" },
      "08_newmark_beta_stability.html": { code: "TRACK 01", name: "구조동역학 · Chopra 진동론" },
      "09_transfer_function_bode.html": { code: "TRACK 01", name: "구조동역학 · Chopra 진동론" },
      "10_fourier_fft_psd.html": { code: "TRACK 01", name: "구조동역학 · Chopra 진동론" },
      "12_modal_superposition_orchestra.html": { code: "TRACK 01", name: "구조동역학 · Chopra 진동론" },
      "13_damping_viscous_vs_coulomb.html": { code: "TRACK 01", name: "구조동역학 · Chopra 진동론" },
      "34_rigid_vs_flexible_whip.html": { code: "TRACK 01", name: "구조동역학 · Chopra 진동론" },
      "35_abssum_equals_static_proof.html": { code: "TRACK 01", name: "구조동역학 · Chopra 진동론" },

      "05_cqc_geometry_cliff_taipei101.html": { code: "TRACK 02", name: "내풍공학 · 초고층 멀티해저드" },
      "11_wind_vs_seismic_load.html": { code: "TRACK 02", name: "내풍공학 · 초고층 멀티해저드" },
      "36_rigid_body_participation_penthouse.html": { code: "TRACK 02", name: "내풍공학 · 초고층 멀티해저드" },

      "02_modal_participation_effective_mass.html": { code: "TRACK 03", name: "규준 내진설계 · KDS 41 모달해석" },
      "03_multistory_response_spectrum.html": { code: "TRACK 03", name: "규준 내진설계 · KDS 41 모달해석" },
      "06_static_vs_dynamic_85pct_scaling.html": { code: "TRACK 03", name: "규준 내진설계 · KDS 41 모달해석" },
      "07_envelope_two_tiers.html": { code: "TRACK 03", name: "규준 내진설계 · KDS 41 모달해석" },
      "38_midas_cqc_diagnostic_tool.html": { code: "TRACK 03", name: "규준 내진설계 · KDS 41 모달해석" },
      "39_newmark_tripartite_adrs.html": { code: "TRACK 03", name: "규준 내진설계 · KDS 41 모달해석" },
      "40_kds_analysis_method_selector.html": { code: "TRACK 03", name: "규준 내진설계 · KDS 41 모달해석" },
      "42_cd_deflection_amplification_inelastic_drift.html": { code: "TRACK 03", name: "규준 내진설계 · KDS 41 모달해석" },
      "43_period_upper_bound_torsion_warning.html": { code: "TRACK 03", name: "규준 내진설계 · KDS 41 모달해석" },
      "45_kds41_seismic_code_navigator_pipeline.html": { code: "TRACK 03", name: "규준 내진설계 · KDS 41 모달해석" },

      "24_rc_column_pm_interaction_diagram.html": { code: "TRACK 04", name: "비선형 성능설계 · FEMA 356 손상역학" },
      "28_fema_backbone_io_ls_cp.html": { code: "TRACK 04", name: "비선형 성능설계 · FEMA 356 손상역학" },
      "29_plastic_hinge_cross_section_damage.html": { code: "TRACK 04", name: "비선형 성능설계 · FEMA 356 손상역학" },
      "37_newmark_equal_displacement_r_factor.html": { code: "TRACK 04", name: "비선형 성능설계 · FEMA 356 손상역학" },
      "41_r_factor_decomposition_dual_system.html": { code: "TRACK 04", name: "비선형 성능설계 · FEMA 356 손상역학" },
      "44_capacity_spectrum_method_performance_point.html": { code: "TRACK 04", name: "비선형 성능설계 · FEMA 356 손상역학" },
    };

    const info = trackInfoMap[filename] || {
      code: "SIMULATOR", name: "구조동역학 시뮬레이터",
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
        <span style="font-size: 0.75rem; font-weight: 700; color: #0f172a; font-family: monospace; background: #f1f5f9; padding: 0.25rem 0.6rem; border-radius: 0.375rem; border: 1px solid #cbd5e1;">
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
