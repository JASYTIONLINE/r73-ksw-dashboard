(function () {
  var featureBtn = document.querySelector('.sidebar-feature-thumb-btn');
  if (!featureBtn) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  window.setInterval(function () {
    featureBtn.classList.add('is-border-flashing');
    window.setTimeout(function () {
      featureBtn.classList.remove('is-border-flashing');
    }, 700);
  }, 4000);
})();
