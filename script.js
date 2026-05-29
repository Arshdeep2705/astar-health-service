/* Astar Health Service — site interactions
   Vanilla JS, no dependencies. Progressive enhancement only. */
(function () {
  "use strict";

  /* ---- Header shadow on scroll ---- */
  var header = document.querySelector(".site-header");
  if (header) {
    var onScroll = function () {
      header.classList.toggle("scrolled", window.scrollY > 8);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ---- Mobile nav toggle ---- */
  var toggle = document.querySelector(".nav-toggle");
  var links = document.querySelector(".nav-links");
  if (toggle && links) {
    toggle.addEventListener("click", function () {
      var open = links.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(open));
      document.body.style.overflow = open ? "hidden" : "";
    });
    // Close menu when a link is clicked
    links.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        links.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
        document.body.style.overflow = "";
      });
    });
    // Close on Escape
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && links.classList.contains("open")) {
        links.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
        document.body.style.overflow = "";
        toggle.focus();
      }
    });
  }

  /* ---- Reveal on scroll ---- */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && revealEls.length) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("in"); });
  }

  /* ---- FAQ accordion ---- */
  document.querySelectorAll(".faq-q").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var expanded = btn.getAttribute("aria-expanded") === "true";
      var panel = document.getElementById(btn.getAttribute("aria-controls"));
      btn.setAttribute("aria-expanded", String(!expanded));
      if (panel) {
        panel.style.maxHeight = expanded ? "0px" : panel.scrollHeight + "px";
      }
    });
  });

  /* ---- Animated counters ---- */
  var counters = document.querySelectorAll("[data-count]");
  if (counters.length && "IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        cio.unobserve(el);
        var target = parseInt(el.getAttribute("data-count"), 10) || 0;
        var start = null, dur = 1100;
        var step = function (ts) {
          if (start === null) start = ts;
          var p = Math.min((ts - start) / dur, 1);
          var eased = 1 - Math.pow(1 - p, 3);
          el.textContent = String(Math.round(eased * target));
          if (p < 1) requestAnimationFrame(step);
          else el.textContent = String(target);
        };
        requestAnimationFrame(step);
      });
    }, { threshold: 0.5 });
    counters.forEach(function (c) { cio.observe(c); });
  }

  /* ---- Footer year ---- */
  var yr = document.getElementById("year");
  if (yr) { yr.textContent = String(new Date().getFullYear()); }

  /* ---- Form validation + simulated submit ---- */
  var form = document.querySelector("[data-validate]");
  if (form) {
    var status = form.querySelector(".form-status");

    var showError = function (field, msg) {
      var input = field.querySelector("input, select, textarea");
      var err = field.querySelector(".error-msg");
      if (input) input.setAttribute("aria-invalid", "true");
      if (err) { err.textContent = msg; err.classList.add("show"); }
    };
    var clearError = function (field) {
      var input = field.querySelector("input, select, textarea");
      var err = field.querySelector(".error-msg");
      if (input) input.removeAttribute("aria-invalid");
      if (err) err.classList.remove("show");
    };

    var validateField = function (field) {
      var input = field.querySelector("input, select, textarea");
      if (!input) return true;
      var val = (input.value || "").trim();
      var required = input.hasAttribute("required");

      if (required && !val) {
        showError(field, "This field is required.");
        return false;
      }
      if (input.type === "email" && val) {
        var ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
        if (!ok) { showError(field, "Please enter a valid email address."); return false; }
      }
      if (input.type === "tel" && val) {
        var digits = val.replace(/[^\d]/g, "");
        if (digits.length < 8) { showError(field, "Please enter a valid phone number."); return false; }
      }
      clearError(field);
      return true;
    };

    // Validate on blur (not on every keystroke)
    form.querySelectorAll(".field").forEach(function (field) {
      var input = field.querySelector("input, select, textarea");
      if (!input) return;
      input.addEventListener("blur", function () { validateField(field); });
      input.addEventListener("input", function () {
        if (input.getAttribute("aria-invalid") === "true") validateField(field);
      });
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var fields = Array.prototype.slice.call(form.querySelectorAll(".field"));
      var valid = true;
      var firstInvalid = null;
      fields.forEach(function (field) {
        if (!validateField(field)) {
          valid = false;
          if (!firstInvalid) firstInvalid = field.querySelector("input, select, textarea");
        }
      });

      if (!valid) {
        if (status) {
          status.textContent = "Please check the highlighted fields and try again.";
          status.className = "form-status error show";
        }
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      // Simulated success (no backend wired yet — see DEPLOYMENT.md)
      var submitBtn = form.querySelector("[type='submit']");
      if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = "Sending…"; }

      window.setTimeout(function () {
        if (status) {
          status.innerHTML = "Thank you — your enquiry has been received. Our team will be in touch within one business day.";
          status.className = "form-status success show";
          status.scrollIntoView({ behavior: "smooth", block: "center" });
        }
        form.reset();
        if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = submitBtn.getAttribute("data-label") || "Send enquiry"; }
      }, 900);
    });
  }
})();
