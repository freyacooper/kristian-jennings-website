/* ============================================================
   Landing page — smooth scroll only.
   Newsletter form submission is handled by Kit's ck.5.js
   (loaded at the bottom of index.html).
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
})();
