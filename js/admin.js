(function () {
  var PW_HASH_KEY = 'perla_admin_pw_hash';
  var AUTH_KEY = 'perla_admin_authed';
  var DEFAULT_PASSWORD = 'perla2026';

  var loginWrap = document.getElementById('admin-login-wrap');
  var dashWrap = document.getElementById('admin-dash-wrap');
  var loginForm = document.getElementById('admin-login-form');
  var loginPw = document.getElementById('admin-login-pw');
  var loginError = document.getElementById('admin-login-error');
  var toastEl = document.getElementById('admin-toast');
  var dirtyEl = document.getElementById('admin-dirty');
  var mainEl = document.getElementById('admin-main');

  var dirty = false;

  // ---------- crypto helpers ----------
  async function sha256Hex(str) {
    var enc = new TextEncoder().encode(str);
    var buf = await crypto.subtle.digest('SHA-256', enc);
    return Array.from(new Uint8Array(buf)).map(function (b) { return b.toString(16).padStart(2, '0'); }).join('');
  }

  async function ensurePasswordSeeded() {
    if (!localStorage.getItem(PW_HASH_KEY)) {
      var hash = await sha256Hex(DEFAULT_PASSWORD);
      localStorage.setItem(PW_HASH_KEY, hash);
    }
  }

  function toast(msg, isError) {
    toastEl.textContent = msg;
    toastEl.className = 'admin-toast show' + (isError ? ' error' : '');
    clearTimeout(toast._t);
    toast._t = setTimeout(function () { toastEl.classList.remove('show'); }, 2600);
  }

  function markDirty() {
    dirty = true;
    dirtyEl.textContent = 'Cambios sin guardar';
  }
  function markClean() {
    dirty = false;
    dirtyEl.textContent = '';
  }

  // ---------- auth ----------
  loginForm.addEventListener('submit', async function (e) {
    e.preventDefault();
    await ensurePasswordSeeded();
    var hash = await sha256Hex(loginPw.value);
    var stored = localStorage.getItem(PW_HASH_KEY);
    if (hash === stored) {
      sessionStorage.setItem(AUTH_KEY, '1');
      loginError.textContent = '';
      loginPw.value = '';
      showDashboard();
    } else {
      loginError.textContent = 'Contraseña incorrecta.';
    }
  });

  document.getElementById('admin-logout').addEventListener('click', function () {
    sessionStorage.removeItem(AUTH_KEY);
    location.reload();
  });

  async function boot() {
    await ensurePasswordSeeded();
    if (sessionStorage.getItem(AUTH_KEY) === '1') showDashboard();
    else { loginWrap.style.display = ''; dashWrap.style.display = 'none'; }
  }

  // ---------- state ----------
  var state = null;
  var activeTab = 'es';

  function showDashboard() {
    loginWrap.style.display = 'none';
    dashWrap.style.display = '';
    state = {
      content: window.PQStore.load(),
      assets: window.PQStore.loadAssets()
    };
    renderTab();
  }

  document.querySelectorAll('.admin-tab').forEach(function (btn) {
    btn.addEventListener('click', function () {
      activeTab = btn.dataset.tab;
      document.querySelectorAll('.admin-tab').forEach(function (b) { b.classList.toggle('active', b === btn); });
      renderTab();
    });
  });

  function renderTab() {
    mainEl.innerHTML = '';
    if (activeTab === 'images') renderImagesTab();
    else renderLocaleTab(activeTab);
  }

  // ---------- DOM helpers ----------
  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  }

  function section(title) {
    var s = el('section', 'admin-section');
    s.appendChild(el('h2', null, title));
    mainEl.appendChild(s);
    return s;
  }

  function inputRow(container, label, value, onChange, opts) {
    opts = opts || {};
    var wrap = el('div', 'admin-field');
    wrap.appendChild(el('label', null, label));
    var input;
    if (opts.textarea) { input = document.createElement('textarea'); input.rows = opts.rows || 3; }
    else { input = document.createElement('input'); input.type = 'text'; }
    input.value = value || '';
    input.addEventListener('input', function () { onChange(input.value); markDirty(); });
    wrap.appendChild(input);
    container.appendChild(wrap);
    return wrap;
  }

  function linesRow(container, label, arr, onChange) {
    return inputRow(container, label + ' (una por línea)', arr.join('\n'), function (val) {
      onChange(val.split('\n').filter(function (s) { return s.trim().length > 0; }));
    }, { textarea: true, rows: Math.min(Math.max(arr.length, 3), 12) });
  }

  /**
   * Generic editable list of objects with add/remove/reorder.
   * fieldsSpec: [{key, label, type:'text'|'textarea'|'lines'|'select', options?}]
   */
  function objectListField(container, arr, fieldsSpec, newItemFactory) {
    var listWrap = el('div', 'admin-list');
    container.appendChild(listWrap);

    function renderItems() {
      listWrap.innerHTML = '';
      arr.forEach(function (item, idx) {
        var card = el('div', 'admin-list-item');
        fieldsSpec.forEach(function (f) {
          if (f.type === 'lines') {
            linesRow(card, f.label, item[f.key] || [], function (newArr) { item[f.key] = newArr; });
          } else if (f.type === 'select') {
            var wrap = el('div', 'admin-field');
            wrap.appendChild(el('label', null, f.label));
            var select = document.createElement('select');
            f.options().forEach(function (opt) {
              var o = document.createElement('option');
              o.value = opt.value; o.textContent = opt.label;
              if (opt.value === item[f.key]) o.selected = true;
              select.appendChild(o);
            });
            select.addEventListener('change', function () { item[f.key] = select.value; markDirty(); });
            wrap.appendChild(select);
            card.appendChild(wrap);
          } else {
            inputRow(card, f.label, item[f.key], function (val) { item[f.key] = val; }, { textarea: f.type === 'textarea' });
          }
        });
        var actions = el('div', 'admin-list-actions');
        var upBtn = el('button', 'btn-small', '↑'); upBtn.type = 'button'; upBtn.disabled = idx === 0;
        upBtn.addEventListener('click', function () { var t = arr[idx - 1]; arr[idx - 1] = arr[idx]; arr[idx] = t; markDirty(); renderItems(); });
        var downBtn = el('button', 'btn-small', '↓'); downBtn.type = 'button'; downBtn.disabled = idx === arr.length - 1;
        downBtn.addEventListener('click', function () { var t = arr[idx + 1]; arr[idx + 1] = arr[idx]; arr[idx] = t; markDirty(); renderItems(); });
        var delBtn = el('button', 'btn-small btn-danger', 'Eliminar'); delBtn.type = 'button';
        delBtn.addEventListener('click', function () { arr.splice(idx, 1); markDirty(); renderItems(); });
        actions.appendChild(upBtn); actions.appendChild(downBtn); actions.appendChild(delBtn);
        card.appendChild(actions);
        listWrap.appendChild(card);
      });
    }
    renderItems();
    var addBtn = el('button', 'btn-small btn-add', '+ Agregar'); addBtn.type = 'button';
    addBtn.addEventListener('click', function () { arr.push(newItemFactory()); markDirty(); renderItems(); });
    container.appendChild(addBtn);
  }

  // ---------- Images tab ----------
  var ASSET_LABELS = {
    hero: 'Foto principal (hero)', logo: 'Logo del hotel',
    roomDouble: 'Habitación doble', roomKing: 'Habitación king con terraza',
    courtyard: 'Patio interior', lobby: 'Lobby', pool: 'Alberca',
    beach1: 'Tour 1 (malecón)', beach2: 'Tour 2 (dunas)', beach3: 'Tour 3 (isla)',
    exteriorBuilding: 'Fachada (sección de contacto)'
  };

  function renderImagesTab() {
    var s = section('Imágenes del sitio');
    Object.keys(ASSET_LABELS).forEach(function (key) {
      var row = el('div', 'admin-image-field');
      var img = document.createElement('img');
      img.src = state.assets[key];
      row.appendChild(img);
      var meta = el('div', 'meta');
      meta.appendChild(el('div', 'name', ASSET_LABELS[key]));
      var fileInput = document.createElement('input');
      fileInput.type = 'file';
      fileInput.accept = 'image/*';
      fileInput.addEventListener('change', function () {
        var file = fileInput.files[0];
        if (!file) return;
        var reader = new FileReader();
        reader.onload = function () {
          state.assets[key] = reader.result;
          img.src = reader.result;
          markDirty();
        };
        reader.readAsDataURL(file);
      });
      meta.appendChild(fileInput);
      row.appendChild(meta);
      s.appendChild(row);
    });
  }

  // ---------- Locale tab ----------
  function assetOptions() {
    return Object.keys(ASSET_LABELS).map(function (k) { return { value: k, label: ASSET_LABELS[k] }; });
  }

  function renderLocaleTab(locale) {
    var c = state.content[locale];

    var s1 = section('Portada');
    inputRow(s1, 'Frase pequeña (eyebrow)', c.hero.eyebrow, function (v) { c.hero.eyebrow = v; });
    inputRow(s1, 'Título principal', c.hero.headline, function (v) { c.hero.headline = v; });

    var s2 = section('Tarjeta de datos del grupo');
    inputRow(s2, 'Etiqueta contacto', c.meta.contactLabel, function (v) { c.meta.contactLabel = v; });
    inputRow(s2, 'Contacto', c.meta.contact, function (v) { c.meta.contact = v; });
    inputRow(s2, 'Etiqueta empresa/grupo', c.meta.companyLabel, function (v) { c.meta.companyLabel = v; });
    inputRow(s2, 'Empresa / Grupo', c.meta.company, function (v) { c.meta.company = v; });
    inputRow(s2, 'Etiqueta fechas', c.meta.datesLabel, function (v) { c.meta.datesLabel = v; });
    inputRow(s2, 'Fechas del grupo', c.meta.dates, function (v) { c.meta.dates = v; });
    inputRow(s2, 'Etiqueta fecha', c.meta.dateLabel, function (v) { c.meta.dateLabel = v; });
    inputRow(s2, 'Fecha', c.meta.date, function (v) { c.meta.date = v; });

    var s3 = section('Introducción');
    inputRow(s3, 'Párrafo de bienvenida', c.intro, function (v) { c.intro = v; }, { textarea: true, rows: 5 });
    inputRow(s3, 'Texto "toca para ver detalle"', c.tapHint, function (v) { c.tapHint = v; });

    var s4 = section('Tarifas y Condiciones');
    inputRow(s4, 'Título de la sección', c.rates.title, function (v) { c.rates.title = v; });
    inputRow(s4, 'Check-in', c.rates.checkIn, function (v) { c.rates.checkIn = v; });
    inputRow(s4, 'Check-out', c.rates.checkOut, function (v) { c.rates.checkOut = v; });
    s4.appendChild(el('label', null, 'Filas de la tabla de tarifas'));
    objectListField(s4, c.rates.rows, [
      { key: 'category', label: 'Categoría' },
      { key: 'day1', label: 'Columna 1 (ej. 1 dic)' },
      { key: 'day2', label: 'Columna 2 (ej. 2 dic)' },
      { key: 'totalRooms', label: 'Total habitaciones' },
      { key: 'rate', label: 'Tarifa' },
      { key: 'subtotal', label: 'Subtotal' }
    ], function () { return { category: '', day1: '', day2: '', totalRooms: '', rate: '', subtotal: '' }; });
    inputRow(s4, 'Nota al pie (impuestos, etc.)', c.rates.footnote, function (v) { c.rates.footnote = v; }, { textarea: true, rows: 3 });
    inputRow(s4, 'Etiqueta gran total', c.rates.grandTotalLabel, function (v) { c.rates.grandTotalLabel = v; });
    inputRow(s4, 'Subtexto gran total', c.rates.grandTotalSub, function (v) { c.rates.grandTotalSub = v; });
    inputRow(s4, 'Monto gran total', c.rates.grandTotalAmount, function (v) { c.rates.grandTotalAmount = v; });
    inputRow(s4, 'Moneda', c.rates.grandTotalCurrency, function (v) { c.rates.grandTotalCurrency = v; });
    inputRow(s4, 'Etiqueta de concesiones', c.rates.concessionsLabel, function (v) { c.rates.concessionsLabel = v; });
    linesRow(s4, 'Concesiones para el grupo', c.rates.concessions, function (v) { c.rates.concessions = v; });

    var s5 = section('Agenda Estimada');
    inputRow(s5, 'Título de la sección', c.agenda.title, function (v) { c.agenda.title = v; });
    inputRow(s5, 'Párrafo introductorio', c.agenda.intro, function (v) { c.agenda.intro = v; }, { textarea: true, rows: 3 });
    s5.appendChild(el('label', null, 'Partidas de la agenda'));
    objectListField(s5, c.agenda.items, [
      { key: 'event', label: 'Evento' },
      { key: 'day', label: 'Día' },
      { key: 'time', label: 'Hora' },
      { key: 'place', label: 'Lugar' },
      { key: 'pax', label: 'Personas (pax)' },
      { key: 'total', label: 'Total' },
      { key: 'description', label: 'Descripción', type: 'textarea' }
    ], function () { return { event: '', day: '', time: '', place: '', pax: '', total: '', description: '' }; });
    inputRow(s5, 'Etiqueta total agenda', c.agenda.totalLabel, function (v) { c.agenda.totalLabel = v; });
    inputRow(s5, 'Monto total agenda', c.agenda.totalAmount, function (v) { c.agenda.totalAmount = v; });
    inputRow(s5, 'Moneda', c.agenda.totalCurrency, function (v) { c.agenda.totalCurrency = v; });

    var s6 = section('Habitaciones');
    inputRow(s6, 'Título de la sección', c.rooms.title, function (v) { c.rooms.title = v; });
    inputRow(s6, 'Párrafo introductorio', c.rooms.intro, function (v) { c.rooms.intro = v; }, { textarea: true, rows: 3 });
    s6.appendChild(el('label', null, 'Tipos de habitación'));
    objectListField(s6, c.rooms.types, [
      { key: 'imageKey', label: 'Foto', type: 'select', options: assetOptions },
      { key: 'alt', label: 'Texto alternativo (accesibilidad)' },
      { key: 'title', label: 'Título' },
      { key: 'size', label: 'Tamaño' }
    ], function () { return { imageKey: 'roomDouble', alt: '', title: '', size: '' }; });
    inputRow(s6, 'Etiqueta de amenidades', c.rooms.amenitiesLabel, function (v) { c.rooms.amenitiesLabel = v; });
    linesRow(s6, 'En todas las habitaciones', c.rooms.amenities, function (v) { c.rooms.amenities = v; });

    var s7 = section('Amenidades y Experiencias');
    inputRow(s7, 'Título de la sección', c.amenities.title, function (v) { c.amenities.title = v; });
    inputRow(s7, 'Etiqueta amenidades del hotel', c.amenities.hotelAmenitiesLabel, function (v) { c.amenities.hotelAmenitiesLabel = v; });
    linesRow(s7, 'Amenidades del hotel', c.amenities.hotelAmenities, function (v) { c.amenities.hotelAmenities = v; });
    inputRow(s7, 'Etiqueta actividades', c.amenities.activitiesLabel, function (v) { c.amenities.activitiesLabel = v; });
    s7.appendChild(el('label', null, 'Grupos de actividades'));
    objectListField(s7, c.amenities.activityGroups, [
      { key: 'title', label: 'Título del grupo' },
      { key: 'items', label: 'Actividades', type: 'lines' }
    ], function () { return { title: '', items: [] }; });
    inputRow(s7, 'Leyenda de fotos de tours', c.amenities.tourCaption, function (v) { c.amenities.tourCaption = v; });
    var hint7 = el('p', null, 'Las fotos (patio, lobby, alberca, tours) se editan en la pestaña "Imágenes".');
    hint7.style.cssText = 'font-size:12px;color:#8C7C68;margin-top:-6px;';
    s7.appendChild(hint7);

    var s8 = section('Espacios para Eventos');
    inputRow(s8, 'Título de la sección', c.venues.title, function (v) { c.venues.title = v; });
    inputRow(s8, 'Párrafo introductorio', c.venues.intro, function (v) { c.venues.intro = v; }, { textarea: true, rows: 3 });
    s8.appendChild(el('label', null, 'Salones / espacios'));
    objectListField(s8, c.venues.list, [
      { key: 'name', label: 'Nombre' },
      { key: 'size', label: 'Tamaño' }
    ], function () { return { name: '', size: '' }; });

    var s9 = section('Políticas del Hotel');
    inputRow(s9, 'Título de la sección', c.policies.title, function (v) { c.policies.title = v; });
    s9.appendChild(el('label', null, 'Datos rápidos (check-in, check-out, etc.)'));
    objectListField(s9, c.policies.quickFacts, [
      { key: 'label', label: 'Etiqueta' },
      { key: 'value', label: 'Valor' }
    ], function () { return { label: '', value: '' }; });
    s9.appendChild(el('label', null, 'Bloques de política'));
    objectListField(s9, c.policies.blocks, [
      { key: 'title', label: 'Título' },
      { key: 'text', label: 'Texto', type: 'textarea' }
    ], function () { return { title: '', text: '' }; });

    var s10 = section('Contacto');
    inputRow(s10, 'Título de la sección', c.contact.title, function (v) { c.contact.title = v; });
    inputRow(s10, 'Nombre del hotel', c.contact.hotelName, function (v) { c.contact.hotelName = v; });
    inputRow(s10, 'Dirección línea 1', c.contact.addressLine1, function (v) { c.contact.addressLine1 = v; });
    inputRow(s10, 'Dirección línea 2', c.contact.addressLine2, function (v) { c.contact.addressLine2 = v; });
    inputRow(s10, 'Nombre del contacto de ventas', c.contact.contactName, function (v) { c.contact.contactName = v; });
    inputRow(s10, 'Puesto', c.contact.contactTitle, function (v) { c.contact.contactTitle = v; });
    inputRow(s10, 'Correo', c.contact.contactEmail, function (v) { c.contact.contactEmail = v; });

    var s11 = section('Pie de página');
    inputRow(s11, 'Aviso legal', c.footer, function (v) { c.footer = v; }, { textarea: true, rows: 2 });
  }

  // ---------- Save ----------
  document.getElementById('admin-save').addEventListener('click', function () {
    window.PQStore.save(state.content);
    window.PQStore.saveAssets(state.assets);
    markClean();
    toast('Cambios guardados. La página pública ya los refleja.');
  });

  document.getElementById('admin-reset').addEventListener('click', function () {
    if (!confirm('¿Restablecer todo el contenido a los valores originales del diseño? Se perderán los cambios guardados.')) return;
    window.PQStore.reset();
    state = { content: window.PQStore.load(), assets: window.PQStore.loadAssets() };
    renderTab();
    markClean();
    toast('Contenido restablecido a los valores originales.');
  });

  document.getElementById('admin-preview').addEventListener('click', function () {
    window.PQStore.save(state.content);
    window.PQStore.saveAssets(state.assets);
    markClean();
    window.open('index.html', '_blank');
  });

  // ---------- Change password ----------
  var pwForm = document.getElementById('admin-pw-form');
  pwForm.addEventListener('submit', async function (e) {
    e.preventDefault();
    var cur = document.getElementById('admin-pw-current').value;
    var next = document.getElementById('admin-pw-new').value;
    var confirmPw = document.getElementById('admin-pw-confirm').value;
    var msgEl = document.getElementById('admin-pw-msg');
    var curHash = await sha256Hex(cur);
    if (curHash !== localStorage.getItem(PW_HASH_KEY)) {
      msgEl.textContent = 'La contraseña actual no es correcta.';
      msgEl.style.color = '#B23A2E';
      return;
    }
    if (next.length < 4) {
      msgEl.textContent = 'La nueva contraseña debe tener al menos 4 caracteres.';
      msgEl.style.color = '#B23A2E';
      return;
    }
    if (next !== confirmPw) {
      msgEl.textContent = 'La confirmación no coincide.';
      msgEl.style.color = '#B23A2E';
      return;
    }
    localStorage.setItem(PW_HASH_KEY, await sha256Hex(next));
    msgEl.textContent = 'Contraseña actualizada.';
    msgEl.style.color = '#2E7D32';
    pwForm.reset();
  });

  // ---------- Export standalone HTML ----------
  function blobToDataURL(blob) {
    return new Promise(function (resolve, reject) {
      var r = new FileReader();
      r.onload = function () { resolve(r.result); };
      r.onerror = reject;
      r.readAsDataURL(blob);
    });
  }

  async function toDataURI(url) {
    if (url.indexOf('data:') === 0) return url;
    var resp = await fetch(url);
    var blob = await resp.blob();
    return blobToDataURL(blob);
  }

  async function buildAssetDataURIs(assets) {
    var out = {};
    var keys = Object.keys(assets);
    for (var i = 0; i < keys.length; i++) {
      out[keys[i]] = await toDataURI(assets[keys[i]]);
    }
    return out;
  }

  function safeJSON(obj) {
    return JSON.stringify(obj).replace(/</g, '\\u003c');
  }

  async function buildStandaloneHTML(content, assets) {
    var cssResp = await fetch('css/styles.css');
    var cssText = await cssResp.text();
    var renderResp = await fetch('js/render.js');
    var renderJsText = await renderResp.text();
    var dataAssets = await buildAssetDataURIs(assets);

    var bootstrap = [
      '(function(){',
      '  var state = { locale: "es", open: new Set(), content: window.__PQ_CONTENT__, assets: window.__PQ_ASSETS__ };',
      '  var root = document.getElementById("pq-root");',
      '  function render(){',
      '    var c = state.content[state.locale];',
      '    root.innerHTML = window.PQRender.renderQuotePage(c, state.assets, state.open);',
      '    document.documentElement.lang = state.locale;',
      '    document.querySelectorAll(".pq-locale-btn").forEach(function(btn){ btn.classList.toggle("active", btn.dataset.locale===state.locale); });',
      '  }',
      '  root.addEventListener("click", function(e){',
      '    var btn = e.target.closest("[data-toggle]"); if(!btn) return;',
      '    var key = btn.dataset.toggle;',
      '    if(state.open.has(key)) state.open.delete(key); else state.open.add(key);',
      '    render();',
      '  });',
      '  document.querySelectorAll(".pq-locale-btn").forEach(function(btn){',
      '    btn.addEventListener("click", function(){ state.locale = btn.dataset.locale; render(); });',
      '  });',
      '  render();',
      '})();'
    ].join('\n');

    return '<!DOCTYPE html>\n' +
      '<html lang="es">\n<head>\n<meta charset="utf-8">\n' +
      '<meta name="viewport" content="width=device-width, initial-scale=1">\n' +
      '<title>Hotel Perla La Paz &middot; Propuesta Grupal</title>\n' +
      '<link rel="preconnect" href="https://fonts.googleapis.com">\n' +
      '<link href="https://fonts.googleapis.com/css2?family=Cormorant:wght@400;500;600&family=Work+Sans:wght@400;500;600&display=swap" rel="stylesheet">\n' +
      '<style>' + cssText + '</style>\n' +
      '</head>\n<body>\n' +
      '<div class="pq-locale-toggle">\n' +
      '  <button type="button" class="pq-locale-btn" data-locale="es">ES</button>\n' +
      '  <button type="button" class="pq-locale-btn" data-locale="en">EN</button>\n' +
      '</div>\n' +
      '<div id="pq-root"></div>\n' +
      '<script>\n' + renderJsText + '\n' +
      'window.__PQ_CONTENT__ = ' + safeJSON(content) + ';\n' +
      'window.__PQ_ASSETS__ = ' + safeJSON(dataAssets) + ';\n' +
      bootstrap + '\n' +
      '<' + '/script>\n' +
      '</body>\n</html>\n';
  }

  document.getElementById('admin-download').addEventListener('click', async function () {
    var btn = this;
    btn.disabled = true;
    var originalText = btn.textContent;
    btn.textContent = 'Generando...';
    try {
      window.PQStore.save(state.content);
      window.PQStore.saveAssets(state.assets);
      markClean();
      var html = await buildStandaloneHTML(state.content, state.assets);
      var blob = new Blob([html], { type: 'text/html' });
      var url = URL.createObjectURL(blob);
      var a = document.createElement('a');
      a.href = url;
      a.download = 'hotel-perla-propuesta-grupal.html';
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      toast('HTML descargado.');
    } catch (err) {
      console.error(err);
      toast('No se pudo generar el HTML: ' + err.message, true);
    } finally {
      btn.disabled = false;
      btn.textContent = originalText;
    }
  });

  boot();
})();
