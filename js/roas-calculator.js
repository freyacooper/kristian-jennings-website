/* ============================================================
   ROAS Calculator — live calculation + UI bindings
   Math:
     vatAmount  = price - price / (1 + vat/100)       (VAT-inclusive)
     feesAmount = price * fees/100
     CPA break-even = price - vatAmount - cogs - shipping - feesAmount - other
     ROAS break-even = price / CPA break-even
     ROAS @ margin   = price / (CPA break-even - margin * price)
   ============================================================ */
(function () {
  "use strict";

  var root = document.querySelector("[data-roas-calc]");
  if (!root) return;

  var inputs = root.querySelectorAll("[data-roas-input]");
  var outputs = root.querySelectorAll("[data-roas-output]");
  var currencySelect = root.querySelector("[data-roas-currency]");
  var currencyPrefixes = root.querySelectorAll("[data-currency-prefix]");
  var toggleBtns = root.querySelectorAll("[data-target-mode]");
  var toggleEl = root.querySelector(".roas-toggle");
  var marginField = root.querySelector('[data-target-field="margin"]');
  var roasField = root.querySelector('[data-target-field="roas"]');
  var contextEl = root.querySelector("[data-target-context]");

  // Default Target CPA basis. Reads from whichever toggle button is
  // currently marked active in the markup so the JS state matches DOM.
  var targetMode = "margin";
  Array.prototype.forEach.call(toggleBtns, function (b) {
    if (b.classList.contains("is-active")) targetMode = b.dataset.targetMode;
  });
  if (toggleEl) toggleEl.dataset.active = targetMode;

  /* ---------- math ---------- */
  function compute(state) {
    var price = state.price;
    var vatRate = state.vat / 100;
    var feesRate = state.fees / 100;
    var vatAmount = price > 0 ? price - price / (1 + vatRate) : 0;
    var feesAmount = price * feesRate;
    var cpa = price - vatAmount - state.cogs - state.shipping - feesAmount - state.other;
    var roas = cpa > 0 ? price / cpa : 0;
    function marginRoas(margin) {
      var denom = cpa - margin * price;
      return denom > 0 ? price / denom : 0;
    }

    // Target CPA: how much we can spend per acquisition and still hit
    // the user's desired margin / ROAS.
    //   margin mode → targetCpa = break-even CPA − (margin × price)
    //   roas mode   → targetCpa = price ÷ desired ROAS
    var targetCpa;
    if (state.targetMode === "roas") {
      targetCpa = state.targetRoas > 0 ? price / state.targetRoas : 0;
    } else {
      targetCpa = cpa - (state.targetMargin / 100) * price;
    }

    return {
      cpaBreakEven: cpa,
      roasBreakEven: roas,
      roas10: marginRoas(0.10),
      roas20: marginRoas(0.20),
      roas30: marginRoas(0.30),
      targetCpa: targetCpa
    };
  }

  /* ---------- formatting ---------- */
  function fmtRatio(v) {
    if (!isFinite(v) || v <= 0) return "—";
    return v.toFixed(2);
  }
  function fmtAmount(v) {
    if (!isFinite(v) || v <= 0) return "—";
    // Trim trailing zeros if integer; otherwise show 2dp
    if (Math.round(v * 100) % 100 === 0) return v.toFixed(0);
    return v.toFixed(2);
  }

  /* ---------- DOM bindings ---------- */
  function readState() {
    var state = { targetMode: targetMode };
    Array.prototype.forEach.call(inputs, function (input) {
      var key = input.dataset.roasInput;
      var n = parseFloat(input.value);
      state[key] = isFinite(n) && n >= 0 ? n : 0;
    });
    return state;
  }

  // Outputs whose key is a currency amount (vs. a ratio) — format dp
  // and "—" handling differs.
  var AMOUNT_KEYS = { cpaBreakEven: 1, targetCpa: 1 };

  function writeOutputs(result) {
    Array.prototype.forEach.call(outputs, function (el) {
      var key = el.dataset.roasOutput;
      if (AMOUNT_KEYS[key]) el.textContent = fmtAmount(result[key]);
      else el.textContent = fmtRatio(result[key]);
    });
  }

  function updateContext(state) {
    if (!contextEl) return;
    if (state.targetMode === "roas") {
      var r = state.targetRoas;
      contextEl.textContent = "Based on a " + (isFinite(r) ? r : 0) + "× ROAS.";
    } else {
      var m = state.targetMargin;
      contextEl.textContent = "Based on a " + (isFinite(m) ? m : 0) + "% profit margin.";
    }
  }

  function recalc() {
    var state = readState();
    writeOutputs(compute(state));
    updateContext(state);
  }

  /* ---------- currency switching ---------- */
  function applyCurrencySymbol(symbol) {
    Array.prototype.forEach.call(currencyPrefixes, function (el) {
      el.textContent = symbol;
    });
  }
  function onCurrencyChange() {
    var opt = currencySelect.options[currencySelect.selectedIndex];
    var symbol = (opt && opt.dataset.symbol) || "€";
    applyCurrencySymbol(symbol);
  }

  /* ---------- target-mode toggle ---------- */
  function setTargetMode(mode) {
    targetMode = mode;
    if (toggleEl) toggleEl.dataset.active = mode;
    Array.prototype.forEach.call(toggleBtns, function (b) {
      var active = b.dataset.targetMode === mode;
      b.classList.toggle("is-active", active);
      b.setAttribute("aria-selected", active ? "true" : "false");
    });
    if (marginField) marginField.hidden = (mode !== "margin");
    if (roasField)   roasField.hidden   = (mode !== "roas");
    recalc();
  }

  /* ---------- wire up ---------- */
  Array.prototype.forEach.call(inputs, function (input) {
    input.addEventListener("input", recalc);
  });
  if (currencySelect) currencySelect.addEventListener("change", onCurrencyChange);
  Array.prototype.forEach.call(toggleBtns, function (b) {
    b.addEventListener("click", function () { setTargetMode(b.dataset.targetMode); });
  });

  // Initial paint (recalc + sync currency)
  if (currencySelect) onCurrencyChange();
  recalc();
})();
