/* ============================================================
   Nav — desktop hover dropdowns + mobile sheet
   Vanilla JS, no dependencies.
   ============================================================ */
(function () {
  "use strict";

  /* ---------- Desktop dropdowns (Tools / Resources) ---------- */
  // Hover-driven, with keyboard + click fallback. Mouse-leave closes
  // immediately so the menu feels reactive.
  document.querySelectorAll("[data-nav-dd]").forEach(function (dd) {
    var trigger = dd.querySelector(".nav-dd-trigger");
    if (!trigger) return;

    var open = function () {
      dd.setAttribute("data-open", "1");
      trigger.setAttribute("aria-expanded", "true");
    };
    var close = function () {
      dd.setAttribute("data-open", "0");
      trigger.setAttribute("aria-expanded", "false");
    };
    var toggle = function () {
      if (dd.getAttribute("data-open") === "1") close(); else open();
    };

    dd.addEventListener("mouseenter", open);
    dd.addEventListener("mouseleave", close);
    trigger.addEventListener("click", function (e) {
      e.preventDefault();
      toggle();
    });
    trigger.addEventListener("focus", open);

    // Close when focus leaves the whole dropdown wrapper
    dd.addEventListener("focusout", function (e) {
      if (!dd.contains(e.relatedTarget)) close();
    });

    // Close on outside click
    document.addEventListener("click", function (e) {
      if (!dd.contains(e.target)) close();
    });

    // Esc closes and returns focus to trigger
    dd.addEventListener("keydown", function (e) {
      if (e.key === "Escape") {
        close();
        trigger.focus();
      }
    });

    // Close on item activation
    dd.querySelectorAll(".nav-dd-item").forEach(function (item) {
      item.addEventListener("click", close);
    });
  });

  /* ---------- Mobile sheet ---------- */
  // Sub-menu definitions — extend by adding entries here as new
  // tools/resources are added.
  var SUBS = {
    tools: {
      label: "Tools",
      links: [
        { name: "iMessage Screenshot Maker", href: "/tools/imessage-screenshot-maker/" },
        { name: "ROAS Calculator", href: "/tools/roas-calculator/" }
      ]
    },
    resources: {
      label: "Resources",
      links: [{ name: "Sound Effect Bank", href: "/resources/sound-effect-bank/" }]
    }
  };

  var ICON_ARROW =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" ' +
    'stroke-linecap="round" stroke-linejoin="round">' +
    '<path d="M5 12h14M13 5l7 7-7 7" /></svg>';
  var ICON_BACK =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" ' +
    'stroke-linecap="round" stroke-linejoin="round">' +
    '<path d="M19 12H5M12 19l-7-7 7-7" /></svg>';
  var ICON_X =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" ' +
    'stroke-linecap="round" stroke-linejoin="round">' +
    '<path d="M6 6l12 12M18 6L6 18" /></svg>';

  var burger = document.querySelector("[data-nav-burger]");
  if (!burger) return;

  var scrim = null;
  var sheet = null;
  var currentSection = null; // null | "tools" | "resources"

  var openSheet = function () {
    if (sheet) return;
    burger.setAttribute("aria-expanded", "true");
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";

    scrim = document.createElement("div");
    scrim.className = "nav-scrim";
    scrim.setAttribute("aria-hidden", "true");
    scrim.addEventListener("click", closeSheet);
    document.body.appendChild(scrim);

    sheet = document.createElement("div");
    sheet.className = "nav-sheet";
    sheet.setAttribute("role", "dialog");
    sheet.setAttribute("aria-label", "Menu");
    document.body.appendChild(sheet);

    renderMain();
  };

  var closeSheet = function () {
    if (!sheet) return;
    burger.setAttribute("aria-expanded", "false");
    document.documentElement.style.overflow = "";
    document.body.style.overflow = "";
    if (scrim) scrim.remove();
    if (sheet) sheet.remove();
    scrim = null;
    sheet = null;
    currentSection = null;
  };

  var headHTML = function (titleText, withBack) {
    return (
      '<div class="nav-sheet-head">' +
        (withBack
          ? '<button class="nav-burger nav-sheet-back" type="button" aria-label="Back to menu" data-sheet-back>' + ICON_BACK + '</button>'
          : '<span class="caption" style="letter-spacing:0.14em;text-transform:uppercase;font-weight:500">Menu</span>') +
        '<span class="nav-sheet-title">' + titleText + '</span>' +
        '<button class="nav-burger" type="button" aria-label="Close menu" data-sheet-close>' + ICON_X + '</button>' +
      '</div>'
    );
  };

  var renderMain = function () {
    currentSection = null;
    sheet.innerHTML =
      headHTML("", false) +
      '<nav class="nav-sheet-menu" data-direction="back">' +
        '<button type="button" class="nav-sheet-row" data-open-section="tools">' +
          '<span>Tools</span>' +
          '<span class="nav-sheet-arrow">' + ICON_ARROW + '</span>' +
        '</button>' +
        '<button type="button" class="nav-sheet-row" data-open-section="resources">' +
          '<span>Resources</span>' +
          '<span class="nav-sheet-arrow">' + ICON_ARROW + '</span>' +
        '</button>' +
      '</nav>';
    bindSheetEvents();
  };

  var renderSub = function (key) {
    var sub = SUBS[key];
    if (!sub) return;
    currentSection = key;
    var linksHTML = sub.links.map(function (l) {
      return (
        '<a href="' + l.href + '" data-sheet-link>' +
          '<span>' + l.name + '</span>' +
          '<span class="nav-sheet-arrow">' + ICON_ARROW + '</span>' +
        '</a>'
      );
    }).join("");
    sheet.innerHTML =
      headHTML(sub.label, true) +
      '<nav class="nav-sheet-menu" data-direction="forward">' + linksHTML + '</nav>';
    bindSheetEvents();
  };

  var bindSheetEvents = function () {
    sheet.querySelectorAll("[data-open-section]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        renderSub(btn.getAttribute("data-open-section"));
      });
    });
    var back = sheet.querySelector("[data-sheet-back]");
    if (back) back.addEventListener("click", renderMain);
    var close = sheet.querySelector("[data-sheet-close]");
    if (close) close.addEventListener("click", closeSheet);
    sheet.querySelectorAll("[data-sheet-link]").forEach(function (a) {
      a.addEventListener("click", closeSheet);
    });
  };

  burger.addEventListener("click", function () {
    if (sheet) closeSheet(); else openSheet();
  });

  // Esc closes the sheet
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && sheet) closeSheet();
  });
})();
