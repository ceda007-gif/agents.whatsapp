(function () {
  var state = {
    locale: localStorage.getItem('perla_quote_locale') || 'es',
    open: new Set(),
    content: window.PQStore.load(),
    assets: window.PQStore.loadAssets()
  };

  var root = document.getElementById('pq-root');

  function render() {
    var c = state.content[state.locale];
    root.innerHTML = window.PQRender.renderQuotePage(c, state.assets, state.open);
    document.documentElement.lang = state.locale;
    updateLocaleButtons();
  }

  function updateLocaleButtons() {
    document.querySelectorAll('.pq-locale-btn').forEach(function (btn) {
      btn.classList.toggle('active', btn.dataset.locale === state.locale);
    });
  }

  root.addEventListener('click', function (e) {
    var btn = e.target.closest('[data-toggle]');
    if (!btn) return;
    var key = btn.dataset.toggle;
    if (state.open.has(key)) state.open.delete(key);
    else state.open.add(key);
    render();
  });

  document.querySelectorAll('.pq-locale-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      state.locale = btn.dataset.locale;
      localStorage.setItem('perla_quote_locale', state.locale);
      render();
    });
  });

  render();
})();
