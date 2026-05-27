/* ============================================================
   Icon Library — interactive grid + download bar
   - Fetches each SVG once, caches it, renders an icon card.
   - Edit controls (stroke / colour / background toggle) update
     every rendered icon live via attributes and a class.
   - Clicking a card slides up a glassmorphism download bar with
     SVG / PNG (3 sizes) options. Clicking the same card again
     (or the close button) slides it back down.
   - PNG export rasterises the live SVG on a <canvas> so the
     downloaded file reflects the current edit settings.
   ============================================================ */
(function () {
  "use strict";

  // Manifest of icon filenames (sans .svg). Mirrors /assets/resources/icons.
  var ICONS = [
    "arrow-down", "arrow-down-left", "arrow-down-right",
    "arrow-left", "arrow-right",
    "arrow-up", "arrow-up-left", "arrow-up-right",
    "bar-chart", "chat-bubble", "circle-fading-plus",
    "coins", "credit-card", "currency-exchange",
    "delivery-truck", "envelope", "faq-question",
    "filter", "fire-trending", "gift-box", "headset",
    "heart", "line-graph", "notification-bell",
    "open-box", "package-box", "person-avatar",
    "price-tag", "search", "settings-gear",
    "shield-trust", "shipped-checkmark", "shopping-bag",
    "shopping-cart", "star-rating", "storefront",
    "tracking-pin", "trophy", "wallet"
  ];

  var ICON_BASE = "/assets/resources/icons/";
  // PNG output sizes — small, medium, large.
  var PNG_SIZES = { "png-128": 128, "png-512": 512, "png-1024": 1024 };

  var SETTINGS = {
    stroke: 2,
    color: "#011f2f",
    background: false,
    bgColor: "#d7f4f2"   // mist; editable when background toggle is on
  };

  var iconCache = {};      // name → raw SVG string
  var activeIcon = null;   // name of the icon shown in the bar
  var grid = document.querySelector("[data-icon-grid]");
  var controls = document.querySelector("[data-controls]");
  var bar = document.querySelector("[data-download-bar]");
  var hideTimer = 0;

  function displayName(name) {
    return name.replace(/-/g, " ").replace(/(^|\s)\S/g, function (c) { return c.toUpperCase(); });
  }

  /* ---------- icon loading ---------- */
  function loadIcon(name) {
    if (iconCache[name]) return Promise.resolve(iconCache[name]);
    return fetch(ICON_BASE + name + ".svg")
      .then(function (r) { return r.text(); })
      .then(function (txt) { iconCache[name] = txt; return txt; });
  }

  /* ---------- render ---------- */
  function buildCard(name, svgText) {
    var card = document.createElement("button");
    card.type = "button";
    card.className = "icon-card";
    card.setAttribute("role", "listitem");
    card.setAttribute("aria-label", displayName(name));
    card.dataset.iconName = name;
    card.innerHTML =
      '<span class="icon-tile" data-tile>' + svgText + '</span>' +
      '<span class="icon-name">' + displayName(name) + '</span>';
    card.addEventListener("click", function () { onIconClick(name); });
    return card;
  }

  function renderGrid() {
    if (!grid) return Promise.resolve();
    return Promise.all(ICONS.map(loadIcon)).then(function (svgs) {
      var frag = document.createDocumentFragment();
      ICONS.forEach(function (name, i) {
        frag.appendChild(buildCard(name, svgs[i]));
      });
      grid.appendChild(frag);
      applySettings();
    });
  }

  /* ---------- apply edit settings to all rendered icons ---------- */
  function applySettings() {
    // Update every rendered SVG (cards + the bar preview tile)
    document.querySelectorAll(".icon-tile svg").forEach(function (svg) {
      svg.setAttribute("stroke-width", SETTINGS.stroke);
      svg.style.color = SETTINGS.color;
    });
    // Update every tile (cards + the bar preview tile) — background
    // is driven by both a class (for shape) and inline color (so the
    // user-chosen bgColor wins over the CSS default mist).
    document.querySelectorAll(".icon-tile").forEach(function (tile) {
      tile.classList.toggle("has-bg", SETTINGS.background);
      tile.style.background = SETTINGS.background ? SETTINGS.bgColor : "";
    });
  }

  /* ---------- controls wiring ---------- */
  function wireControls() {
    if (!controls) return;
    var strokeBtns = controls.querySelectorAll("[data-stroke]");
    var customColorInput = controls.querySelector("[data-color-picker]");
    var bgToggle = controls.querySelector("[data-bg-toggle]");
    var bgState = controls.querySelector("[data-bg-state]");
    var bgPicker = controls.querySelector("[data-bg-picker]");
    var bgPickerWrap = controls.querySelector("[data-bg-picker-wrap]");

    /* stroke */
    strokeBtns.forEach(function (btn) {
      btn.addEventListener("click", function () {
        SETTINGS.stroke = parseFloat(btn.dataset.stroke);
        strokeBtns.forEach(function (b) {
          var on = b === btn;
          b.classList.toggle("is-active", on);
          b.setAttribute("aria-checked", on ? "true" : "false");
        });
        applySettings();
      });
    });

    /* colour — full picker, no presets. */
    if (customColorInput) {
      customColorInput.addEventListener("input", function () {
        SETTINGS.color = customColorInput.value;
        applySettings();
      });
    }

    /* background toggle + background colour picker */
    function setBgPickerVisible(visible) {
      if (!bgPickerWrap) return;
      bgPickerWrap.classList.toggle("is-hidden", !visible);
    }

    if (bgToggle) {
      bgToggle.addEventListener("change", function () {
        SETTINGS.background = bgToggle.checked;
        if (bgState) bgState.textContent = bgToggle.checked ? "On" : "Off";
        setBgPickerVisible(bgToggle.checked);
        applySettings();
      });
    }
    if (bgPicker) {
      bgPicker.addEventListener("input", function () {
        SETTINGS.bgColor = bgPicker.value;
        applySettings();
      });
    }
  }

  /* ---------- download bar ---------- */
  function onIconClick(name) {
    if (activeIcon === name) {
      hideBar();
    } else {
      showBar(name);
    }
  }

  function showBar(name) {
    if (!bar) return;
    activeIcon = name;
    bar.hidden = false;
    // Defer adding the class so the visibility/transform transition runs
    clearTimeout(hideTimer);
    requestAnimationFrame(function () {
      requestAnimationFrame(function () { bar.classList.add("is-open"); });
    });
    var nameEl = bar.querySelector("[data-bar-name]");
    if (nameEl) nameEl.textContent = displayName(name);
    // Highlight the active card
    grid.querySelectorAll(".icon-card").forEach(function (c) {
      c.classList.toggle("is-active", c.dataset.iconName === name);
    });
    updateBarPreview(name);
  }

  function hideBar() {
    if (!bar) return;
    bar.classList.remove("is-open");
    clearTimeout(hideTimer);
    hideTimer = setTimeout(function () { bar.hidden = true; }, 400);
    activeIcon = null;
    grid.querySelectorAll(".icon-card.is-active").forEach(function (c) {
      c.classList.remove("is-active");
    });
  }

  function updateBarPreview(name) {
    // The bar's preview tile uses the same .icon-tile element as the
    // grid cards, so applySettings() handles the background state for
    // us. We just need to drop the correct SVG in.
    var tile = bar.querySelector("[data-bar-tile]");
    if (!tile) return;
    var card = grid.querySelector('[data-icon-name="' + name + '"]');
    if (!card) return;
    var svg = card.querySelector("svg");
    if (!svg) return;
    var clone = svg.cloneNode(true);
    clone.removeAttribute("width");
    clone.removeAttribute("height");
    tile.innerHTML = "";
    tile.appendChild(clone);
    applySettings();  // sync the new tile's stroke/colour/bg
  }

  /* ---------- download helpers ---------- */
  function triggerDownload(blob, filename) {
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(function () { URL.revokeObjectURL(url); }, 1500);
  }

  // Returns a clean exportable SVG string for the given icon, with
  // the current colour/stroke baked in as static attributes (no
  // currentColor reliance) and optional background circle.
  function buildExportableSvg(name) {
    var card = grid.querySelector('[data-icon-name="' + name + '"]');
    if (!card) return "";
    var liveSvg = card.querySelector("svg");
    if (!liveSvg) return "";
    var clone = liveSvg.cloneNode(true);
    // Strip width/height so the receiving app can scale it; keep viewBox
    clone.removeAttribute("width");
    clone.removeAttribute("height");
    clone.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    clone.setAttribute("stroke", SETTINGS.color);
    clone.setAttribute("stroke-width", SETTINGS.stroke);
    // strip inline style colour (would override stroke)
    clone.removeAttribute("style");

    if (SETTINGS.background) {
      // Wrap icon (scaled down + centred) inside a 24x24 SVG with a
      // background circle so the downloaded asset matches what the
      // user sees on the page.
      var innerSerialized = new XMLSerializer().serializeToString(clone);
      // Pull out the inside (just the children) of the cloned svg
      var innerHtml = clone.innerHTML;
      var svg =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="' + SETTINGS.color + '" stroke-width="' + SETTINGS.stroke + '" stroke-linecap="round" stroke-linejoin="round">' +
          '<circle cx="12" cy="12" r="12" fill="' + SETTINGS.bgColor + '" stroke="none"/>' +
          '<g transform="translate(4.8 4.8) scale(0.6)">' + innerHtml + '</g>' +
        '</svg>';
      return svg;
    }
    return new XMLSerializer().serializeToString(clone);
  }

  function downloadSvg(name) {
    var svgString = buildExportableSvg(name);
    var blob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
    triggerDownload(blob, name + ".svg");
  }

  function downloadPng(name, size) {
    var svgString = buildExportableSvg(name);
    var blob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
    var url = URL.createObjectURL(blob);
    var img = new Image();
    img.onload = function () {
      var canvas = document.createElement("canvas");
      canvas.width = size;
      canvas.height = size;
      var ctx = canvas.getContext("2d");
      // Anti-alias / smooth scaling
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(img, 0, 0, size, size);
      URL.revokeObjectURL(url);
      canvas.toBlob(function (out) {
        if (out) triggerDownload(out, name + "-" + size + ".png");
      }, "image/png");
    };
    img.onerror = function () { URL.revokeObjectURL(url); };
    img.src = url;
  }

  /* ---------- wire the bar buttons ---------- */
  function wireBar() {
    if (!bar) return;
    bar.querySelectorAll("[data-download]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        if (!activeIcon) return;
        var type = btn.dataset.download;
        if (type === "svg") {
          downloadSvg(activeIcon);
        } else if (PNG_SIZES[type]) {
          downloadPng(activeIcon, PNG_SIZES[type]);
        }
      });
    });
    var closeBtn = bar.querySelector("[data-bar-close]");
    if (closeBtn) closeBtn.addEventListener("click", hideBar);

    // Esc closes the bar
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && activeIcon) hideBar();
    });
  }

  /* ---------- init ---------- */
  function init() {
    wireControls();
    wireBar();
    renderGrid();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
