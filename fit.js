/**
 * fit.js — Disabled. Scroll is now enabled normally.
 * Scale is reset so content scrolls naturally.
 */
(function () {
  function resetFit() {
    const section = document.querySelector('.section');
    if (section) {
      section.style.transform = 'none';
      section.style.zoom = '';
    }
    const main = document.querySelector('main');
    if (main) {
      main.style.height   = '';
      main.style.overflow = '';
    }
  }
  window.addEventListener('load', resetFit);
  if (document.readyState !== 'loading') resetFit();
  else document.addEventListener('DOMContentLoaded', resetFit);
})();
