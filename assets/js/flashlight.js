/* ============================== Flashlight interaction ============================== */

(() => {
  "use strict";

  const overlay = document.getElementById("flashlight-overlay");
  const toggle = document.getElementById("flashlight-toggle");

  if (!overlay || !toggle) return;

  let lightsOut = false;

  function updateSpotlight(x, y) {
    overlay.style.setProperty("--flashlight-x", `${x}px`);
    overlay.style.setProperty("--flashlight-y", `${y}px`);
  }

  function updateButtonLabel() {
    const language = document.documentElement.dataset.lang === "en" ? "en" : "fa";
    const state = lightsOut ? "on" : "off";
    const label = toggle.dataset[`${language}${state.charAt(0).toUpperCase()}${state.slice(1)}`];

    toggle.textContent = label;
    toggle.setAttribute("aria-label", label);
    toggle.setAttribute("aria-pressed", String(lightsOut));
    toggle.title = label;
  }

  function handlePointerMove(event) {
    updateSpotlight(event.clientX, event.clientY);
  }

  function toggleLights(event) {
    lightsOut = !lightsOut;

    if (lightsOut) {
      if (event.detail === 0) {
        updateSpotlight(window.innerWidth / 2, window.innerHeight / 2);
      } else {
        updateSpotlight(event.clientX, event.clientY);
      }
    }

    document.body.classList.toggle("lights-out", lightsOut);
    updateButtonLabel();
  }

  document.addEventListener("pointermove", handlePointerMove, { passive: true });
  document.addEventListener("pointerdown", handlePointerMove, { passive: true });
  toggle.addEventListener("click", toggleLights);

  const languageObserver = new MutationObserver(updateButtonLabel);
  languageObserver.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-lang"]
  });

  updateSpotlight(window.innerWidth / 2, window.innerHeight / 2);
  updateButtonLabel();
})();
