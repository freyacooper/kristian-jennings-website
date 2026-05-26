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
    return {
      cpaBreakEven: cpa,
      roasBreakEven: roas,
      roas10: marginRoas(0.10),
      roas20: marginRoas(0.20),
      roas30: marginRoas(0.30)
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
    var state = {};
    Array.prototype.forEach.call(inputs, function (input) {
      var key = input.dataset.roasInput;
      var n = parseFloat(input.value);
      state[key] = isFinite(n) && n >= 0 ? n : 0;
    });
    return state;
  }

  function writeOutputs(result) {
    Array.prototype.forEach.call(outputs, function (el) {
      var key = el.dataset.roasOutput;
      if (key === "cpaBreakEven") el.textContent = fmtAmount(result[key]);
      else el.textContent = fmtRatio(result[key]);
    });
  }

  function recalc() {
    writeOutputs(compute(readState()));
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

  /* ---------- wire up ---------- */
  Array.prototype.forEach.call(inputs, function (input) {
    input.addEventListener("input", recalc);
  });
  if (currencySelect) currencySelect.addEventListener("change", onCurrencyChange);

  // Initial paint (recalc + sync currency)
  if (currencySelect) onCurrencyChange();
  recalc();
})();
