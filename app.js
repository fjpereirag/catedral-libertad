/* La Catedral de la Libertad · lógica de páginas */
(function () {
  'use strict';
  var D = window.CL; if (!D) return;
  var L = D.lamparas, N = L.length;
  document.documentElement.classList.add('js');

  /* ---------- progreso (solo en este dispositivo) ---------- */
  var KEY = 'cl-encendidas';
  function leer() { try { return JSON.parse(localStorage.getItem(KEY) || '[]'); } catch (e) { return []; } }
  function guardar(a) { try { localStorage.setItem(KEY, JSON.stringify(a)); } catch (e) {} window.dispatchEvent(new Event('cl:progreso')); }
  function encendida(n) { return leer().indexOf(n) !== -1; }
  function encender(n) { var a = leer(); if (a.indexOf(n) === -1) { a.push(n); a.sort(function (x, y) { return x - y; }); guardar(a); } }
  function apagar(n) { guardar(leer().filter(function (x) { return x !== n; })); }
  function siguiente() { var a = leer(); for (var i = 1; i <= N; i++) if (a.indexOf(i) === -1) return i; return 0; }

  /* tamaño de letra */
  try { if (localStorage.getItem('cl-letra') === 'grande') document.documentElement.classList.add('letra-grande'); } catch (e) {}

  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function etapaDe(n) { for (var i = 0; i < D.etapas.length; i++) { var e = D.etapas[i]; if (n >= e.desde && n <= e.hasta) return e; } }
  function nn(n) { return (n < 10 ? '0' : '') + n; }
  function img(n) { return 'assets_img/lampara-' + nn(n) + '.webp'; }
  /* foto realista si existe; si falta, vuelve a la ilustración */
  function foto(n) { return 'assets_img/foto-lampara-' + nn(n) + '.webp'; }
  function fallback(n) { return ' onerror="this.onerror=null;this.src=\'' + img(n) + '\';this.classList.add(\'ilus\')"'; }

  function pintarProgreso() {
    var a = leer(), sig = siguiente();
    document.querySelectorAll('[data-progreso]').forEach(function (el) {
      if (!a.length) el.textContent = 'Quince lámparas te esperan apagadas en la nave.';
      else if (a.length === N) el.textContent = 'Has encendido las quince lámparas. La nave entera está iluminada.';
      else el.textContent = 'Has encendido ' + a.length + (a.length === 1 ? ' lámpara' : ' lámparas') + ' de quince.';
    });
    document.querySelectorAll('[data-continuar]').forEach(function (el) {
      var hero = el.closest('.hero-acciones');
      if (!a.length) { el.href = 'lampara.html?n=1'; el.textContent = hero ? 'Encender la primera lámpara' : 'Empezar'; }
      else if (sig) { el.href = 'lampara.html?n=' + sig; el.textContent = hero ? 'Seguir por la lámpara ' + sig : 'Seguir · ' + sig; }
      else { el.href = 'altar.html'; el.textContent = hero ? 'Ir al altar' : 'Altar'; }
    });
    document.querySelectorAll('[data-lampara]').forEach(function (el) {
      el.classList.toggle('encendida', a.indexOf(+el.getAttribute('data-lampara')) !== -1);
    });
  }
  window.addEventListener('cl:progreso', pintarProgreso);

  document.addEventListener('click', function (e) {
    var r = e.target.closest('[data-reiniciar]');
    if (r) { guardar([]); }
  });

  /* ---------- portada ---------- */
  function portada() {
    var cont = document.getElementById('etapas');
    if (!cont) return;
    cont.id = 'lamparas';
    cont.innerHTML = D.etapas.map(function (e, k) {
      var items = L.slice(e.desde - 1, e.hasta).map(function (l) {
        return '<li><a class="item-lampara" data-lampara="' + l.n + '" href="lampara.html?n=' + l.n + '">' +
          '<span class="item-img"><img src="' + foto(l.n) + '"' + fallback(l.n) + ' alt="" width="152" height="152" loading="lazy"></span>' +
          '<span class="item-txt"><span class="item-tit">' + esc(l.titulo) + '</span>' +
          '<span class="item-meta">Lámpara ' + l.n + ' · ' + esc(l.matiz) + ' · <i>' + esc(l.obra) + '</i>, ' + esc(l.autor) + '</span>' +
          '<span class="item-llevar">' + esc(l.llevar) + '</span></span>' +
          '<span class="item-estado" aria-hidden="true"></span></a></li>';
      }).join('');
      return '<section class="etapa etapa-' + (k + 1) + '" id="etapa-' + e.id + '" aria-labelledby="etapa-t-' + e.id + '">' +
        '<div class="etapa-cab"><p class="etapa-num" aria-hidden="true">' + e.id + '</p>' +
        '<div><h2 id="etapa-t-' + e.id + '">Etapa ' + e.id + ' · ' + esc(e.nombre) + '</h2>' +
        '<p>' + esc(e.texto) + '</p><p class="etapa-rango">Lámparas ' + e.desde + ' a ' + e.hasta + '</p>' +
        '<figure class="etapa-foto" data-foto3d="0.035"><img src="assets_img/foto-etapa-' + (k + 1) + '.webp" alt="" loading="lazy" onerror="this.parentNode.remove()"></figure></div></div>' +
        '<ol class="lista-lamparas" start="' + e.desde + '">' + items + '</ol></section>' +
        (k < 2 ? '<div class="ventana" aria-hidden="true"></div>' : '');
    }).join('');
    mapa();
  }

  function mapa() {
    var svg = document.getElementById('mapa-svg'), lista = document.getElementById('mapa-lista');
    if (!svg) return;
    var ns = 'http://www.w3.org/2000/svg', C = 300, R = 210, out = '';
    var colores = ['#c0764a', '#8f9b62', '#6f8fb0'];
    // anillos
    out += '<circle cx="300" cy="300" r="270" class="m-anillo"/><circle cx="300" cy="300" r="' + R + '" class="m-anillo m-anillo-2"/>';
    L.forEach(function (l, i) {
      var ang = -Math.PI / 2 + i * 2 * Math.PI / N;
      var x = C + R * Math.cos(ang), y = C + R * Math.sin(ang);
      out += '<line x1="300" y1="300" x2="' + x.toFixed(1) + '" y2="' + y.toFixed(1) + '" class="m-radio"/>';
    });
    out += '<circle cx="300" cy="300" r="92" class="m-centro"/><text x="300" y="296" class="m-libertad">LIBERTAD</text><text x="300" y="326" class="m-sub">para amar y servir</text>';
    L.forEach(function (l, i) {
      var ang = -Math.PI / 2 + i * 2 * Math.PI / N;
      var x = C + R * Math.cos(ang), y = C + R * Math.sin(ang);
      var lx = C + 262 * Math.cos(ang), ly = C + 262 * Math.sin(ang);
      var anchor = Math.abs(Math.cos(ang)) < 0.25 ? 'middle' : (Math.cos(ang) > 0 ? 'start' : 'end');
      var col = colores[Math.floor(i / 5)];
      out += '<a href="lampara.html?n=' + l.n + '" class="m-luz" data-lampara="' + l.n + '" aria-label="Lámpara ' + l.n + ': ' + esc(l.matiz) + '">' +
        '<circle cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="30" class="m-halo"/>' +
        '<circle cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="21" class="m-punto" style="--c:' + col + '"/>' +
        '<text x="' + x.toFixed(1) + '" y="' + (y + 6).toFixed(1) + '" class="m-n">' + l.n + '</text>' +
        '<text x="' + lx.toFixed(1) + '" y="' + (ly + 6).toFixed(1) + '" text-anchor="' + anchor + '" class="m-et">' + esc(l.matiz) + '</text></a>';
    });
    svg.insertAdjacentHTML('beforeend', out);
    svg.setAttribute('viewBox', '-90 -10 780 620');
    lista.innerHTML = D.etapas.map(function (e, k) {
      return '<li><span class="ml-etapa" style="--c:' + colores[k] + '">' + esc(e.nombre) + '</span> ' +
        L.slice(e.desde - 1, e.hasta).map(function (l) { return '<a data-lampara="' + l.n + '" href="lampara.html?n=' + l.n + '">' + esc(l.matiz) + '</a>'; }).join(', ') + '</li>';
    }).join('');
  }

  /* ---------- página de lámpara ---------- */
  function paginaLampara() {
    var main = document.getElementById('lampara');
    if (!main) return;
    var n = parseInt(new URLSearchParams(location.search).get('n'), 10);
    if (!(n >= 1 && n <= N)) n = 1;
    var l = L[n - 1], e = etapaDe(n);
    document.title = l.titulo + ' · La Catedral de la Libertad';
    var url = location.href.split('#')[0];
    var wa = 'https://wa.me/?text=' + encodeURIComponent('La Catedral de la Libertad · Lámpara ' + n + ': ' + l.titulo + '\n«' + l.llevar + '»\n' + url);
    var palabras = l.lectura.join(' ').split(/\s+/).length + l.detente.split(/\s+/).length + l.oracion.split(/\s+/).length;
    var min = Math.max(3, Math.round(palabras / 180));
    var ant = n > 1 ? L[n - 2] : null, sig = n < N ? L[n] : null;

    main.innerHTML =
      '<article class="lamp" data-lampara="' + n + '">' +
      '<figure class="lamp-foto" data-foto3d="0.03"><img src="' + foto(n) + '" alt="Fotografía de la lámpara ' + n + ': ' + esc(l.matiz) + '" onerror="this.closest(\'.lamp\').classList.add(\'sin-foto\');this.parentNode.remove()"><span class="lamp-velo" aria-hidden="true"></span></figure>' +
      '<header class="lamp-cab">' +
        '<div class="lamp-img"><img src="' + img(n) + '" width="304" height="304" alt="Ilustración de la lámpara ' + n + ': ' + esc(l.matiz) + '"><span class="lamp-luz" aria-hidden="true"></span></div>' +
        '<div class="lamp-cab-txt">' +
          '<h1>' + esc(l.titulo) + '</h1>' +
          '<p class="lamp-fuente">Inspirada en <i>' + esc(l.obra) + '</i>, de ' + esc(l.autor) + '</p>' +
          '<p class="lamp-datos">Lámpara ' + n + ' de ' + N + ' · ' + esc(l.matiz) + ' · <a href="index.html#etapa-' + e.id + '">Etapa ' + e.id + ', ' + esc(e.nombre) + '</a> · ' + min + ' min de lectura</p>' +
          '<div class="lamp-herr"><button type="button" class="btn btn-linea btn-peq" data-letra>Letra más grande</button>' +
          '<a class="btn btn-linea btn-peq" href="' + wa + '" target="_blank" rel="noopener">Enviar por WhatsApp</a></div>' +
        '</div>' +
      '</header>' +
      '<div class="lectura">' + l.lectura.map(function (p) { return '<p>' + esc(p) + '</p>'; }).join('') + '</div>' +
      '<section class="bloque detente" aria-labelledby="b1"><h2 id="b1">Detente un momento</h2><p>' + esc(l.detente) + '</p></section>' +
      '<section class="bloque palabra" aria-labelledby="b2"><h2 id="b2">Palabra de Dios</h2><blockquote><p>' + esc(l.palabra) + '</p><cite>' + esc(l.cita) + '</cite></blockquote></section>' +
      '<section class="bloque paso" aria-labelledby="b3"><h2 id="b3">Un paso para hoy</h2><p>' + esc(l.paso) + '</p></section>' +
      '<section class="bloque oracion" aria-labelledby="b4"><h2 id="b4">Oración</h2><p>' + esc(l.oracion) + '</p></section>' +
      '<section class="llevar" aria-labelledby="b5"><h2 id="b5">Para llevar contigo</h2><p class="llevar-frase">' + esc(l.llevar) + '</p>' +
        '<button type="button" class="btn btn-oro btn-encender" data-encender>Encender esta lámpara</button>' +
        '<p class="llevar-nota" data-progreso aria-live="polite"></p></section>' +
      '</article>' +
      '<nav class="lamp-nav" aria-label="Otras lámparas">' +
        (ant ? '<a class="ln-ant" href="lampara.html?n=' + (n - 1) + '"><span>Lámpara anterior</span>' + esc(ant.titulo) + '</a>' : '<a class="ln-ant" href="index.html#camino"><span>Antes de empezar</span>Un camino por la catedral</a>') +
        (sig ? '<a class="ln-sig" href="lampara.html?n=' + (n + 1) + '"><span>Lámpara siguiente</span>' + esc(sig.titulo) + '</a>' : '<a class="ln-sig" href="altar.html"><span>Final del camino</span>Llegar al altar</a>') +
      '</nav>' +
      '<nav class="rosario" aria-label="Las quince lámparas"><ol>' + L.map(function (x) {
        return '<li><a data-lampara="' + x.n + '" href="lampara.html?n=' + x.n + '"' + (x.n === n ? ' aria-current="page"' : '') + ' title="' + esc(x.titulo) + '">' + x.n + '</a></li>';
      }).join('') + '<li><a class="ros-altar" href="altar.html" title="El altar">✝</a></li></ol></nav>';

    var btn = main.querySelector('[data-encender]');
    function estado() {
      var on = encendida(n);
      btn.textContent = on ? 'Lámpara encendida · apagar' : 'Encender esta lámpara';
      btn.setAttribute('aria-pressed', on ? 'true' : 'false');
      main.querySelector('.lamp').classList.toggle('encendida', on);
    }
    btn.addEventListener('click', function () { encendida(n) ? apagar(n) : encender(n); estado(); });
    estado();

    var bl = main.querySelector('[data-letra]');
    function etLetra() { bl.textContent = document.documentElement.classList.contains('letra-grande') ? 'Letra normal' : 'Letra más grande'; }
    bl.addEventListener('click', function () {
      var g = document.documentElement.classList.toggle('letra-grande');
      try { localStorage.setItem('cl-letra', g ? 'grande' : 'normal'); } catch (e) {}
      etLetra();
    });
    etLetra();
    document.addEventListener('keydown', function (ev) {
      if (ev.target.closest('input,textarea')) return;
      if (ev.key === 'ArrowRight') location.href = sig ? 'lampara.html?n=' + (n + 1) : 'altar.html';
      if (ev.key === 'ArrowLeft' && ant) location.href = 'lampara.html?n=' + (n - 1);
    });
  }

  /* ---------- altar ---------- */
  function altar() {
    var ol = document.getElementById('letania-lista');
    if (!ol) return;
    ol.innerHTML = L.map(function (l) {
      return '<li data-lampara="' + l.n + '"><a href="lampara.html?n=' + l.n + '"><span class="let-matiz">' + esc(l.matiz) + '</span><span class="let-frase">' + esc(l.llevar) + '</span></a></li>';
    }).join('');
  }

  /* ---------- aparición al entrar en pantalla ---------- */
  function apariciones() {
    var sel = '.intro-txt,.pregunta,.etapa-cab,.item-lampara,.mapa-txt,.mapa-fig,.infografia figure,.info-txt,.altar-cierre > *,.lectura p,.bloque,.llevar > *,.letania li,.altar-hero > *';
    var els = document.querySelectorAll(sel);
    if (!('IntersectionObserver' in window) || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    var io = new IntersectionObserver(function (ents) {
      ents.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('visto'); io.unobserve(en.target); } });
    }, { rootMargin: '0px 0px -8% 0px' });
    els.forEach(function (el, i) {
      var par = el.parentElement, idx = Array.prototype.indexOf.call(par.children, el);
      el.style.setProperty('--d', Math.min(idx, 6) * 70 + 'ms');
      el.classList.add('aparece'); io.observe(el);
    });
  }

  /* cabecera compacta al bajar */
  var cab = document.querySelector('.cabecera');
  function cabScroll() { if (cab) cab.classList.toggle('compacta', window.scrollY > 40); }
  window.addEventListener('scroll', cabScroll, { passive: true });

  portada(); paginaLampara(); altar(); pintarProgreso(); apariciones(); cabScroll();
})();
