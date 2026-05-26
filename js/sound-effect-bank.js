/* ============================================================
   Sound Effect Bank — instant playback + real waveforms
   - All 72 mp3s are decoded via Web Audio API on page load (4 in
     parallel) so every row shows its real waveform on initial render
     AND has a ready-to-play AudioBuffer in memory.
   - Playback uses AudioBufferSourceNode (not <audio>), so clicking
     play triggers zero fetch and zero decode — sound starts on the
     next audio frame. The HTML5 Audio path is kept as a fallback for
     rows whose decode hasn't completed yet.
   - The whole row is the click target. Clicking the download link
     does not start playback (its handler is excluded by the row's
     click-target check).
   - Progress is driven by requestAnimationFrame reading
     AudioContext.currentTime, exposed as the CSS custom property
     --progress (0–100%). The .audio-wave-fill layer uses clip-path
     to reveal the played portion in bright teal.
   ============================================================ */
(function () {
  "use strict";

  /* ---------- manifest ---------- */
  var BASE = "/assets/resources/Sound effects/";
  var MANIFEST = [
    { folder: "UI", title: "UI", files: [
      "Bamboo clonk.mp3","Beep.mp3","Button click.mp3","Camera shutter.mp3","Camera.mp3","Censor beep.mp3","Chat notification.mp3","Classic error.mp3","Click.mp3","Ding 2.mp3","Ding.mp3","Error dong dong.mp3","Error pop.mp3","Error tiktok.mp3","Message sent.mp3","Mouse click.mp3","Notification 3 tone.mp3","Notification.mp3","Online call.mp3","Phone camera.mp3","Phone typing.mp3","Pop bing.mp3","Typing satisfying.mp3","Typing.mp3"
    ]},
    { folder: "Cartoon", title: "Cartoon", files: [
      "Blink.mp3","Boing.mp3","Cartoon steps.mp3","Electronic boing.mp3","Heartbeat.mp3","Punch.mp3","Whoosh punch.mp3"
    ]},
    { folder: "Gaming", title: "Gaming", files: [
      "1-up.mp3","Coin collect.mp3","Coin.mp3","Level complete.mp3","Level up.mp3","Oowow.mp3","Retro coin.mp3"
    ]},
    { folder: "Transitions", title: "Transitions", files: [
      "Bamboo swish.mp3","Downer.mp3","Dramatic swish.mp3","Futuristic transition.mp3","Metallic suspense.mp3","Rewind.mp3","Riser.mp3","Stutter riser.mp3","Stutter transition.mp3","Swipe.mp3","Swish.mp3","Swoosh.mp3","Whoosh.mp3"
    ]},
    { folder: "Meme:Viral", title: "Meme / Viral", files: [
      "Aaa reverb.mp3","Air horn.mp3","Boom.mp3","Burst laughing.mp3","Bwomp blast.mp3","Core.mp3","FAHHHHHHHHHHHHHHH.mp3","Hello there.mp3","Huh cat.mp3","Mwomp.mp3","Oof.mp3","Sus.mp3","Wait a minute who are you.mp3","What boom.mp3","Why Why Whyy.mp3","Woooooaah.mp3","beeoooooooooooooooooo.mp3","bruh.mp3","hehe yea boi.mp3","wow!.mp3","wowowowowowowow.mp3"
    ]}
  ];

  // We extract 96 peaks per file. The CSS then progressively reveals
  // more bars at wider breakpoints via :nth-child selectors:
  //   ≤400px    → every 8th  (12 visible)
  //   400-699px → every 4th  (24 visible)
  //   700-849px → every 2nd  (48 visible)
  //   ≥850px    → all 96 visible
  var BAR_COUNT = 96;
  var DECODE_CONCURRENCY = 4;

  /* ---------- placeholder patterns (until real wave decodes) ----------
     48-value source patterns are linearly interpolated to BAR_COUNT
     so we get smooth-looking placeholder bars at any bar count. */
  var WAVE_SOURCES = [
    [28,52,78,92,68,44,30,58,86,70,42,28,48,72,88,62,38,24,44,62,82,54,30,46,70,56,34,50,74,88,64,40,26,48,72,90,66,42,30,54,78,60,36,22,46,68,84,52],
    [44,72,90,60,32,50,78,94,64,42,28,52,76,60,36,22,48,70,86,58,34,48,72,56,38,60,80,92,68,44,28,50,74,88,62,38,54,76,90,66,42,28,46,70,84,56,34,52],
    [24,48,70,88,76,52,36,64,84,60,38,24,46,66,80,52,32,50,68,78,50,30,46,64,80,56,32,48,70,86,62,38,26,50,72,84,56,34,48,68,82,54,30,44,66,88,60,36]
  ];
  function expandPattern(src, target) {
    var out = new Array(target);
    var lastIdx = src.length - 1;
    var denom = Math.max(1, target - 1);
    for (var i = 0; i < target; i++) {
      var pos = i * lastIdx / denom;
      var a = Math.floor(pos);
      var b = Math.min(a + 1, lastIdx);
      var t = pos - a;
      out[i] = Math.round(src[a] * (1 - t) + src[b] * t);
    }
    return out;
  }
  var WAVE_PATTERNS = WAVE_SOURCES.map(function (s) { return expandPattern(s, BAR_COUNT); });

  /* ---------- helpers ---------- */
  function encodeSeg(s) { return encodeURIComponent(s); }
  function urlFor(folder, file) { return BASE + encodeSeg(folder) + "/" + encodeSeg(file); }
  function displayName(file) { return file.replace(/\.mp3$/i, ""); }
  function formatTime(sec) {
    if (!isFinite(sec)) return "—";
    var m = Math.floor(sec / 60);
    var s = Math.round(sec % 60);
    if (s === 60) { m += 1; s = 0; }
    return m + ":" + (s < 10 ? "0" : "") + s;
  }
  function svgPlay() {
    return '<svg class="icon-play" viewBox="0 0 12 12" fill="currentColor"><path d="M3 1.5v9l7-4.5z"/></svg>';
  }
  function svgPause() {
    return '<svg class="icon-pause" viewBox="0 0 12 12" fill="currentColor"><rect x="3" y="2" width="2.2" height="8" rx="0.6"/><rect x="6.8" y="2" width="2.2" height="8" rx="0.6"/></svg>';
  }
  function svgDownload() {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v12"/><path d="M7 10l5 5 5-5"/><path d="M4 21h16"/></svg>';
  }

  /* ---------- waveform rendering (dual layer) ---------- */
  function renderBars(wave, heights) {
    var base = document.createElement("div");
    base.className = "audio-wave-base";
    var fill = document.createElement("div");
    fill.className = "audio-wave-fill";
    var fragBase = document.createDocumentFragment();
    var fragFill = document.createDocumentFragment();
    heights.forEach(function (h) {
      var b1 = document.createElement("i"); b1.style.height = h + "%";
      var b2 = document.createElement("i"); b2.style.height = h + "%";
      fragBase.appendChild(b1);
      fragFill.appendChild(b2);
    });
    base.appendChild(fragBase);
    fill.appendChild(fragFill);
    wave.innerHTML = "";
    wave.appendChild(base);
    wave.appendChild(fill);
  }
  function renderPlaceholder(wave, index) {
    var pattern = WAVE_PATTERNS[index % WAVE_PATTERNS.length];
    renderBars(wave, pattern.slice(0, BAR_COUNT));
  }

  /* ---------- shared AudioContext (lazy + resume on user gesture) ---------- */
  var _ctx = null;
  function getCtx() {
    if (!_ctx) _ctx = new (window.AudioContext || window.webkitAudioContext)();
    return _ctx;
  }
  function ensureRunning() {
    var ctx = getCtx();
    if (ctx.state === "suspended" && typeof ctx.resume === "function") {
      ctx.resume();
    }
  }

  /* ---------- caches ---------- */
  // The decoded AudioBuffer (used for instant playback)
  var bufferCache = {};
  // Pending decode promise per URL (so two concurrent requests share one fetch)
  var decodePromises = {};

  function decodeFile(url) {
    if (bufferCache[url]) return Promise.resolve(bufferCache[url]);
    if (decodePromises[url]) return decodePromises[url];
    var p = fetch(url)
      .then(function (r) {
        if (!r.ok) throw new Error("fetch failed: " + r.status);
        return r.arrayBuffer();
      })
      .then(function (buf) { return getCtx().decodeAudioData(buf); })
      .then(function (audioBuf) {
        bufferCache[url] = audioBuf;
        return audioBuf;
      });
    decodePromises[url] = p;
    return p;
  }

  function extractHeights(audioBuf) {
    var data = audioBuf.getChannelData(0);
    var chunk = Math.floor(data.length / BAR_COUNT) || 1;
    var peaks = new Array(BAR_COUNT);
    var globalMax = 0;
    for (var i = 0; i < BAR_COUNT; i++) {
      var localMax = 0;
      var start = i * chunk;
      var end = Math.min(start + chunk, data.length);
      for (var j = start; j < end; j++) {
        var v = data[j];
        if (v < 0) v = -v;
        if (v > localMax) localMax = v;
      }
      peaks[i] = localMax;
      if (localMax > globalMax) globalMax = localMax;
    }
    if (globalMax === 0) globalMax = 1;
    return peaks.map(function (p) {
      return Math.max(8, Math.round((p / globalMax) * 100));
    });
  }

  /* ---------- upfront-decode queue (caps parallelism) ---------- */
  var decodeQueue = [];
  var activeDecodes = 0;
  function queueDecode(row) {
    decodeQueue.push(row);
    pumpQueue();
  }
  function pumpQueue() {
    while (activeDecodes < DECODE_CONCURRENCY && decodeQueue.length > 0) {
      var row = decodeQueue.shift();
      runDecode(row);
    }
  }
  function runDecode(row) {
    var wave = row.querySelector(".audio-wave");
    if (wave && wave.dataset.real) return;
    var url = row.dataset.audioSrc;
    activeDecodes += 1;
    decodeFile(url)
      .then(function (audioBuf) {
        // Real waveform
        var heights = extractHeights(audioBuf);
        if (wave && !wave.dataset.real) {
          renderBars(wave, heights);
          wave.dataset.real = "1";
        }
        // Duration
        var durEl = row.querySelector(".audio-duration");
        if (durEl && (durEl.textContent === "—" || !durEl.textContent.trim())) {
          durEl.textContent = formatTime(audioBuf.duration);
        }
      })
      .catch(function () { /* keep placeholder on failure */ })
      .then(function () {
        activeDecodes -= 1;
        pumpQueue();
      });
  }

  /* ---------- player state ---------- */
  var currentRow = null;
  var currentSource = null;       // AudioBufferSourceNode
  var currentBuffer = null;       // AudioBuffer (for duration)
  var currentStartTime = 0;       // ctx.currentTime when playback started
  var currentFallbackAudio = null; // HTMLAudioElement, fallback only
  var rafId = 0;

  function setRowAriaLabel(row, label) {
    var btn = row.querySelector(".audio-play");
    if (btn) btn.setAttribute("aria-label", label);
  }

  function clearProgress(row) {
    if (!row) return;
    var wave = row.querySelector(".audio-wave");
    if (wave) wave.style.setProperty("--progress", "0%");
  }

  function stopCurrent() {
    if (rafId) { cancelAnimationFrame(rafId); rafId = 0; }
    if (currentSource) {
      try {
        currentSource.onended = null;
        currentSource.stop();
      } catch (e) { /* may already be stopped */ }
      try { currentSource.disconnect(); } catch (e) {}
      currentSource = null;
    }
    if (currentFallbackAudio) {
      currentFallbackAudio.pause();
      currentFallbackAudio.removeAttribute("src");
      try { currentFallbackAudio.load(); } catch (e) {}
      currentFallbackAudio = null;
    }
    currentBuffer = null;
    if (currentRow) {
      var row = currentRow;
      currentRow = null;  // clear first so onended is idempotent
      row.classList.remove("is-playing");
      clearProgress(row);
      var name = (row.querySelector(".audio-name") || {}).textContent || "audio";
      setRowAriaLabel(row, "Play " + name);
    }
  }

  function startProgressLoop(row) {
    var wave = row.querySelector(".audio-wave");
    var ctx = getCtx();
    function tick() {
      // Bail if state has changed under us
      if (currentRow !== row) { rafId = 0; return; }
      if (currentBuffer) {
        var elapsed = ctx.currentTime - currentStartTime;
        var pct = (elapsed / currentBuffer.duration) * 100;
        if (pct < 0) pct = 0;
        if (pct > 100) pct = 100;
        wave.style.setProperty("--progress", pct + "%");
      } else if (currentFallbackAudio && currentFallbackAudio.duration > 0) {
        var pct2 = (currentFallbackAudio.currentTime / currentFallbackAudio.duration) * 100;
        if (pct2 > 100) pct2 = 100;
        wave.style.setProperty("--progress", pct2 + "%");
      }
      rafId = requestAnimationFrame(tick);
    }
    rafId = requestAnimationFrame(tick);
  }

  function playFromBuffer(row, buf) {
    var ctx = getCtx();
    var src = ctx.createBufferSource();
    src.buffer = buf;
    src.connect(ctx.destination);
    src.onended = function () {
      // Auto-revert when audio finishes naturally
      if (currentSource === src) stopCurrent();
    };
    src.start(0);
    currentSource = src;
    currentBuffer = buf;
    currentStartTime = ctx.currentTime;
    currentRow = row;
    row.classList.add("is-playing");
    var name = (row.querySelector(".audio-name") || {}).textContent || "audio";
    setRowAriaLabel(row, "Pause " + name);
    startProgressLoop(row);
  }

  function playFallback(row, url) {
    // HTML5 Audio fallback used only if the buffer isn't decoded yet
    var audio = new Audio(url);
    audio.preload = "auto";
    audio.addEventListener("ended", function () {
      if (currentFallbackAudio === audio) stopCurrent();
    });
    audio.addEventListener("loadedmetadata", function () {
      var durEl = row.querySelector(".audio-duration");
      if (durEl && (durEl.textContent === "—" || !durEl.textContent.trim())) {
        durEl.textContent = formatTime(audio.duration);
      }
    });
    currentFallbackAudio = audio;
    currentRow = row;
    row.classList.add("is-playing");
    var name = (row.querySelector(".audio-name") || {}).textContent || "audio";
    setRowAriaLabel(row, "Pause " + name);
    audio.play()
      .then(function () { startProgressLoop(row); })
      .catch(function () { stopCurrent(); });
  }

  function playRow(row) {
    stopCurrent();
    ensureRunning();
    var url = row.dataset.audioSrc;
    var buf = bufferCache[url];
    if (buf) {
      playFromBuffer(row, buf);
    } else {
      // Buffer not ready — kick the decode to the front of the queue,
      // and start HTML5 fallback playback in the meantime.
      decodeFile(url).then(function (audioBuf) {
        // Render waveform when decode completes (if still on this row)
        var wave = row.querySelector(".audio-wave");
        if (wave && !wave.dataset.real) {
          renderBars(wave, extractHeights(audioBuf));
          wave.dataset.real = "1";
        }
      }).catch(function () {});
      playFallback(row, url);
    }
  }

  function togglePlay(row) {
    if (currentRow === row) stopCurrent();
    else playRow(row);
  }

  /* ---------- row + section build ---------- */
  function buildRow(file, folder, index) {
    var url = urlFor(folder, file);
    var name = displayName(file);
    var row = document.createElement("div");
    row.className = "audio-row";
    row.dataset.audioSrc = url;
    row.innerHTML =
      '<button type="button" class="audio-play" aria-label="Play ' + name + '" tabindex="-1">' +
        svgPlay() + svgPause() +
      '</button>' +
      '<span class="audio-name">' + name + '</span>' +
      '<div class="audio-wave" aria-hidden="true"></div>' +
      '<span class="audio-duration">—</span>' +
      '<a class="audio-download" href="' + url + '" download="' + file + '" aria-label="Download ' + name + '">' +
        svgDownload() +
      '</a>';

    // Single click handler on the whole row. Clicks on the download
    // link bubble through but are excluded here so the browser handles
    // the download instead of starting playback.
    row.addEventListener("click", function (e) {
      if (e.target.closest(".audio-download")) return;
      e.preventDefault();
      togglePlay(row);
    });
    // Keyboard activation: row is a button-like target. Make it focusable
    // and listen for Space/Enter.
    row.setAttribute("role", "button");
    row.setAttribute("tabindex", "0");
    row.addEventListener("keydown", function (e) {
      if (e.key === " " || e.key === "Enter") {
        if (e.target.closest(".audio-download")) return;
        e.preventDefault();
        togglePlay(row);
      }
    });

    renderPlaceholder(row.querySelector(".audio-wave"), index);
    queueDecode(row);
    return row;
  }

  function build() {
    var bank = document.querySelector("[data-audio-bank]");
    if (!bank) return;
    bank.innerHTML = "";
    var globalIndex = 0;
    MANIFEST.forEach(function (cat) {
      var section = document.createElement("div");
      section.className = "audio-section";
      section.innerHTML =
        '<div class="audio-section-head">' +
          '<h2>' + cat.title + '</h2>' +
          '<span class="count">' + cat.files.length + ' sounds</span>' +
        '</div>' +
        '<div class="audio-list"></div>';
      var list = section.querySelector(".audio-list");
      cat.files.forEach(function (file) {
        list.appendChild(buildRow(file, cat.folder, globalIndex));
        globalIndex += 1;
      });
      bank.appendChild(section);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", build);
  } else {
    build();
  }
})();
