/* ============================================================
   Landing page — smooth scroll + newsletter form
   ============================================================ */
(function () {
  "use strict";

  /* ---------- Smooth scroll for in-page anchors ---------- */
  // Any element with data-scroll-to="id" scrolls to that section
  // and (if it's the newsletter) focuses the email input.
  document.querySelectorAll("[data-scroll-to]").forEach(function (el) {
    el.addEventListener("click", function (e) {
      var id = el.getAttribute("data-scroll-to");
      var target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      var top = target.getBoundingClientRect().top + window.pageYOffset - 20;
      window.scrollTo({ top: top, behavior: "smooth" });
      if (id === "newsletter") {
        setTimeout(function () {
          var input = document.getElementById("news-email");
          if (input) input.focus({ preventScroll: true });
        }, 420);
      }
    });
  });

  /* ---------- Newsletter form ---------- */
  var form = document.querySelector("[data-newsletter-form]");
  if (!form) return;

  var input = form.querySelector("#news-email");
  var fine = form.querySelector("[data-newsletter-fine]");
  var fineDefaultHTML = fine ? fine.innerHTML : "";

  var ICON_CHECK =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" ' +
    'stroke-linecap="round" stroke-linejoin="round">' +
    '<path d="M5 12l5 5L20 7" /></svg>';

  var showError = function (msg) {
    if (!fine) return;
    fine.classList.add("is-error");
    fine.innerHTML = '<span>' + msg + '</span>';
  };
  var resetFine = function () {
    if (!fine) return;
    fine.classList.remove("is-error");
    fine.innerHTML = fineDefaultHTML;
  };

  if (input) {
    input.addEventListener("input", resetFine);
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var email = (input && input.value || "").trim();
    if (!email || !/.+@.+\..+/.test(email)) {
      showError("Enter a valid email so we can send your welcome.");
      return;
    }

    // Success: replace the form contents with a confirmation card.
    var card = form.parentNode;
    var success = document.createElement("div");
    success.className = "newsletter-success";
    success.setAttribute("role", "status");
    success.innerHTML =
      '<span class="check">' + ICON_CHECK + '</span>' +
      '<div>' +
        '<div class="title">You\'re in.</div>' +
        '<div class="sub">Check ' + escapeHTML(email) + ' for a welcome with the first issue.</div>' +
      '</div>';
    card.replaceChild(success, form);
  });

  function escapeHTML(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c];
    });
  }
})();
