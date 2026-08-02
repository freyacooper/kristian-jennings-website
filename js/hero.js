/* ============================================================
   Hero — pinned scroll-scrubbed video, in three sequential phases.
   .hero-pin is a tall wrapper; .hero (position:sticky inside it)
   holds at the top of the viewport for the wrapper's whole height,
   giving scroll input to drive (rather than move the page) until the
   wrapper's scroll range is exhausted, at which point position:sticky
   releases it into normal scroll natively — no manual "release"
   logic needed.
   The overall 0→1 progress across that scroll range is split at
   VIDEO_PHASE_END and HEADLINE_PHASE_END into three sub-progress
   values:
     - video phase (0 → VIDEO_PHASE_END): video.currentTime scrubs
       0→duration; headline stays hidden.
     - headline phase (VIDEO_PHASE_END → HEADLINE_PHASE_END): video
       has finished and is swapped for the static end-frame image
       (held on screen); the headline rises to center + fades in.
     - glow phase (HEADLINE_PHASE_END → 1): headline holds fully in
       place; a teal glow blooms behind it for one last beat before
       release.
   The scroll-cue fade-out and the header's solidify state are still
   driven off the overall progress, not any one sub-phase.
   ============================================================ */
(function () {
  "use strict";

  var wrapper = document.querySelector("[data-hero-pin]");
  var hero = document.querySelector("[data-hero]");
  if (!wrapper || !hero) return;

  var video = document.querySelector("[data-hero-video]");
  var fallback = document.querySelector("[data-hero-fallback]");
  var headline = document.querySelector("[data-hero-headline]");
  var cue = document.querySelector("[data-hero-cue]");
  var nav = document.querySelector(".nav");

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Total scroll distance the pin consumes, beyond the initial
  // viewport height. Tune here — everything else derives from it.
  var PIN_VH = 250;
  var HEADLINE_RISE = 120; // px, matches the CSS starting transform
  // Fractions of the overall pin progress spent on each phase — video
  // scrub, then the headline's rise-to-center, then the glow bloom.
  var VIDEO_PHASE_END = 0.58;
  var HEADLINE_PHASE_END = 0.85;

  var ticking = false;
  var videoReady = false;

  function clamp01(n) {
    return Math.max(0, Math.min(1, n));
  }

  // .nav is sticky, so it normally reserves its own height in the
  // document flow before it starts sticking — which would push the
  // pin wrapper (and the hero inside it) down and leave a sliver of
  // the page's default (light) background visible above it. Pull the
  // wrapper up underneath the nav so the dark hero fills the true top
  // of the viewport, with the transparent nav floating over it (nav's
  // own z-index keeps it painting above the hero regardless of this
  // overlap), and stretch by the same amount so the pin doesn't lose
  // scroll distance to the section below.
  function syncNavOverlap() {
    if (!nav) return;
    var navHeight = nav.offsetHeight;
    wrapper.style.marginTop = "-" + navHeight + "px";
    wrapper.style.height = "calc(" + PIN_VH + "vh + " + navHeight + "px)";
  }

  function getProgress() {
    var rect = wrapper.getBoundingClientRect();
    var scrollable = wrapper.offsetHeight - window.innerHeight;
    if (scrollable <= 0) return 1;
    return clamp01(-rect.top / scrollable);
  }

  function update() {
    ticking = false;
    var progress = getProgress();

    if (!reduceMotion) {
      var videoProgress = clamp01(progress / VIDEO_PHASE_END);
      var headlineProgress = clamp01((progress - VIDEO_PHASE_END) / (HEADLINE_PHASE_END - VIDEO_PHASE_END));
      var glowProgress = clamp01((progress - HEADLINE_PHASE_END) / (1 - HEADLINE_PHASE_END));

      if (video && videoReady && video.duration) {
        video.currentTime = videoProgress * video.duration;
      }

      if (headline) {
        headline.style.opacity = String(headlineProgress);
        headline.style.transform = "translateY(" + (HEADLINE_RISE * (1 - headlineProgress)) + "px)";
        headline.style.setProperty("--glow-opacity", String(glowProgress));
        headline.style.setProperty("--glow-scale", String(0.8 + 0.35 * glowProgress));
      }

      if (cue) {
        var cueOpacity = 1 - clamp01(progress / 0.15); // fades out over the first 15% overall
        cue.style.opacity = String(cueOpacity);
        cue.style.pointerEvents = cueOpacity === 0 ? "none" : "";
      }

      // Swap to the static last-frame image once the video phase is
      // done (not at the very end of the overall pin — the headline
      // phase that follows holds on this image while it rises).
      // Cheaper to keep on screen than the video once scrubbing is
      // done, and it also papers over any seek imprecision in the
      // video's own final frame. Slightly before 1 rather than exactly
      // at it, so scroll jitter right at the boundary can't flicker
      // between them.
      var videoDone = videoProgress >= 0.995;
      if (video) video.style.opacity = videoDone ? "0" : "1";
      if (fallback) fallback.style.opacity = videoDone ? "1" : "0";
    }

    if (nav) {
      nav.classList.toggle("is-solid", progress >= 1);
    }
  }

  function onScroll() {
    if (!ticking) {
      ticking = true;
      window.requestAnimationFrame(update);
    }
  }

  function markVideoReady() {
    if (videoReady) return;
    videoReady = true;
    update();
  }

  if (video && !reduceMotion) {
    // Warm up the decoder (helps Safari/iOS scrub reliably) by briefly
    // playing then pausing before scrubbing starts. Important: don't
    // treat the video as scrub-ready until that warm-up has actually
    // finished — the play() promise can take a while to resolve on a
    // large file (it's waiting on buffering), and any currentTime seek
    // performed while it's still pending gets silently discarded the
    // moment playback actually engages. If play() fails outright (e.g.
    // autoplay blocked), fall back to scrubbing as soon as metadata is
    // available, with no warm-up.
    video.muted = true;
    var playPromise = video.play();
    if (playPromise && typeof playPromise.then === "function") {
      playPromise.then(function () {
        video.pause();
        markVideoReady();
      }).catch(function () {
        video.addEventListener("loadedmetadata", markVideoReady, { once: true });
      });
    } else {
      video.addEventListener("loadedmetadata", markVideoReady, { once: true });
    }
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", function () {
    syncNavOverlap();
    onScroll();
  });
  syncNavOverlap();
  update();
})();
