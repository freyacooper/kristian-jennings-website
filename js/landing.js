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

  /* ---------- Newsletter modal ---------- */
  // One modal holds a Kit form per source (navbar/hero/footer). The
  // trigger's data-nl-open value selects which form to reveal so each
  // signup is attributed to its own Kit form; the others stay hidden.
  var modal = document.querySelector("[data-nl-modal]");
  if (modal) {
    var dialog = modal.querySelector(".nl-modal-dialog");
    var forms = modal.querySelectorAll("[data-nl-form]");
    var lastFocus = null;
    var hideTimer = null;

    function showForm(source) {
      var active = null;
      Array.prototype.forEach.call(forms, function (form) {
        var match = form.dataset.nlForm === source;
        form.hidden = !match;
        if (match) active = form;
      });
      // Fall back to the first form if the source didn't match.
      if (!active && forms.length) {
        active = forms[0];
        active.hidden = false;
      }
      return active;
    }

    function openModal(trigger) {
      window.clearTimeout(hideTimer);
      lastFocus = trigger || document.activeElement;
      var source = trigger ? trigger.getAttribute("data-nl-open") : null;
      var activeForm = showForm(source);
      modal.hidden = false;
      // Force reflow so the transition runs from the hidden state.
      void modal.offsetWidth;
      modal.classList.add("is-open");
      document.body.classList.add("nl-lock");
      window.setTimeout(function () {
        var input = activeForm && activeForm.querySelector(".newsletter-input");
        if (input) input.focus({ preventScroll: true });
      }, 80);
    }

    function closeModal() {
      if (modal.hidden) return;
      modal.classList.remove("is-open");
      document.body.classList.remove("nl-lock");
      if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
      // Hide after the close animation (timeout, not transitionend, so it
      // still hides when prefers-reduced-motion disables transitions).
      hideTimer = window.setTimeout(function () {
        modal.hidden = true;
      }, 280);
    }

    document.querySelectorAll("[data-nl-open]").forEach(function (btn) {
      btn.addEventListener("click", function (e) {
        e.preventDefault();
        openModal(btn);
      });
    });
    modal.querySelectorAll("[data-nl-close]").forEach(function (el) {
      el.addEventListener("click", closeModal);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !modal.hidden) closeModal();
    });
  }
})();
