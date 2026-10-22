/* La Catedral de la Libertad · versión móvil, un único camino
   Portada → Etapa I → lámparas 1-5 → Etapa II → 6-10 → Etapa III → 11-15 → Altar */
(function () {
  'use strict';
  var D = window.CL; if (!D) return;
  var L = D.lamparas, N = L.length, E = D.etapas;
  document.documentElement.classList.add('js');

  /* ---------- progreso (solo en este dispositivo) ---------- */
  var KEY = 'cl-encendidas';
  function leer() { try { return JSON.parse(localStorage.getItem(KEY) || '[]'); } catch (e) { return []; } }
  function guardar(a) { try { localStorage.setItem(KEY, JSON.stringify(a)); } catch (e) {} window.dispatchEvent(new Event('cl:progreso')); }
  function encendida(n) { return leer().indexOf(n) !== -1; }
  function encender(n) { var a = leer(); if (a.indexOf(n) === -1) { a.push(n); a.sort(function (x, y) { return x - y; }); guardar(a); } }
  function apagar(n) { guardar(leer().filter(function (x) { return x !== n; })); }
  try { if (localStorage.getItem('cl-letra') === 'grande') document.documentElement.classList.add('letra-grande'); } catch (e) {}

  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function nn(n) { return (n < 10 ? '0' : '') + n; }
  function img(n) { return 'assets_img/lampara-' + nn(n) + '.webp'; }
  function foto(n) { return 'assets_img/foto-lampara-' + nn(n) + '.webp'; }
  function fallback(n) { return ' onerror="this.onerror=null;this.src=\'' + img(n) + '\';this.classList.add(\'ilus\')"'; }
  function etapaDe(n) { for (var i = 0; i < E.length; i++) if (n >= E[i].desde && n <= E[i].hasta) return i; return 0; }

  /* ---------- el camino: una sola secuencia de pasos ---------- */
  var PASOS = [];
  E.forEach(function (e, i) {
    PASOS.push({ tipo: 'etapa', e: i, url: 'etapa.html?e=' + (i + 1), nombre: 'Etapa ' + e.id + ' · ' + e.nombre });
    for (var n = e.desde; n <= e.hasta; n++) PASOS.push({ tipo: 'lampara', n: n, e: i, url: 'lampara.html?n=' + n, nombre: 'Lámpara ' + n + ' · ' + L[n - 1].titulo });
  });
  PASOS.push({ tipo: 'altar', url: 'altar.html', nombre: 'El altar' });
  function indicePaso(tipo, v) {
    for (var i = 0; i < PASOS.length; i++) {
      var p = PASOS[i];
      if (p.tipo === tipo && (tipo === 'altar' || (tipo === 'etapa' ? p.e === v : p.n === v))) return i;
    }
    return 0;
  }
  /* dónde seguir: la primera lámpara sin encender (o su etapa, si aún no se ha empezado) */
  function pasoSiguiente() {
    var a = leer();
    for (var n = 1; n <= N; n++) {
      if (a.indexOf(n) === -1) {
        var e = etapaDe(n), ini = E[e].desde;
        var empezada = false; for (var k = ini; k <= E[e].hasta; k++) if (a.indexOf(k) !== -1) empezada = true;
        return (n === ini && !empezada) ? PASOS[indicePaso('etapa', e)] : PASOS[indicePaso('lampara', n)];
      }
    }
    return PASOS[PASOS.length - 1];
  }

  function pintarProgreso() {
    var a = leer(), sig = pasoSiguiente();
    document.querySelectorAll('[data-pill]').forEach(function (el) { el.textContent = a.length + '/' + N; el.classList.toggle('con-luz', a.length > 0); });
    document.querySelectorAll('[data-progreso]').forEach(function (el) {
      el.textContent = !a.length ? 'Quince lámparas te esperan apagadas.' :
        a.length === N ? 'Has encendido las quince lámparas.' :
        'Has encendido ' + a.length + (a.length === 1 ? ' lámpara' : ' lámparas') + ' de quince.';
    });
    document.querySelectorAll('[data-continuar]').forEach(function (el) {
      el.href = sig.url;
      el.textContent = !a.length ? 'Comenzar el camino' : a.length === N ? 'Llegar al altar' : 'Continuar · ' + (sig.tipo === 'etapa' ? 'Etapa ' + E[sig.e].id : 'Lámpara ' + sig.n);
    });
    document.querySelectorAll('[data-lampara]').forEach(function (el) {
      el.classList.toggle('encendida', a.indexOf(+el.getAttribute('data-lampara')) !== -1);
    });
    var r = document.getElementById('ruta');
    if (r) r.querySelectorAll('.aqui').forEach(function (x) { x.classList.remove('aqui'); }), marcarAqui();
  }
  window.addEventListener('cl:progreso', pintarProgreso);
  document.addEventListener('click', function (e) {
    if (e.target.closest('[data-reiniciar]')) guardar([]);
  });

  /* ---------- barra fija inferior: anterior · progreso · siguiente ---------- */
  function barra(i) {
    var ant = PASOS[i - 1], sig = PASOS[i + 1], p = PASOS[i];
    var segs = L.map(function (x) { return '<i data-lampara="' + x.n + '"' + (p.tipo === 'lampara' && x.n === p.n ? ' class="aqui"' : '') + '></i>'; }).join('');
    var etq = p.tipo === 'altar' ? 'El altar' : p.tipo === 'etapa' ? 'Etapa ' + E[p.e].id : 'Lámpara ' + p.n + ' / ' + N;
    var nav = document.createElement('nav');
    nav.className = 'barra-camino'; nav.setAttribute('aria-label', 'Avanzar por el camino');
    nav.innerHTML =
      '<a class="bc-ant" href="' + (ant ? ant.url : 'index.html') + '" aria-label="' + esc(ant ? 'Anterior: ' + ant.nombre : 'Inicio') + '">&#8249;</a>' +
      '<a class="bc-centro" href="index.html#camino"><span class="bc-txt">' + esc(etq) + '</span><span class="bc-seg">' + segs + '</span></a>' +
      (sig ? '<a class="bc-sig" href="' + sig.url + '" aria-label="' + esc('Siguiente: ' + sig.nombre) + '">Siguiente <b>&#8250;</b></a>'
           : '<a class="bc-sig" href="index.html">Inicio</a>');
    document.body.appendChild(nav);
    var lectura = document.createElement('div'); lectura.className = 'lectura-barra'; lectura.setAttribute('aria-hidden', 'true'); lectura.innerHTML = '<i></i>';
    document.body.appendChild(lectura);
    function mover() {
      var max = document.documentElement.scrollHeight - innerHeight, q = max > 0 ? scrollY / max : 0;
      lectura.firstChild.style.transform = 'scaleX(' + Math.min(1, q).toFixed(4) + ')';
    }
    addEventListener('scroll', mover, { passive: true }); mover();
    document.body.classList.add('con-barra');
    return sig;
  }


  /* ---------- reproductor de audio (solo aparece si el MP3 existe) ---------- */
  function reproductor(donde, src, titulo, antes) {
    if (!donde) return;
    var caja = document.createElement('div');
    caja.className = 'audio'; caja.hidden = true;
    caja.innerHTML = '<button type="button" class="audio-btn" aria-label="Escuchar"><span class="audio-ico" aria-hidden="true"></span><span class="audio-txt">Escuchar</span></button>' +
      '<span class="audio-barra" aria-hidden="true"><i></i></span><span class="audio-t">0:00</span>';
    if (antes) donde.insertBefore(caja, antes); else donde.appendChild(caja);
    var a = new Audio(); a.preload = 'none'; a.src = src;
    var btn = caja.querySelector('.audio-btn'), txt = caja.querySelector('.audio-txt'), barra = caja.querySelector('.audio-barra i'), t = caja.querySelector('.audio-t');
    function mmss(x) { x = Math.max(0, Math.round(x || 0)); return Math.floor(x / 60) + ':' + ('0' + x % 60).slice(-2); }
    fetch(src, { method: 'HEAD' }).then(function (r) { if (r.ok) caja.hidden = false; }).catch(function () {});
    btn.addEventListener('click', function () { a.paused ? a.play() : a.pause(); });
    a.addEventListener('play', function () {
      caja.classList.add('sonando'); txt.textContent = 'Pausa'; btn.setAttribute('aria-label', 'Pausar');
      if ('mediaSession' in navigator) navigator.mediaSession.metadata = new MediaMetadata({ title: titulo, artist: 'La Catedral de la Libertad', artwork: [{ src: 'assets_img/foto-nave.webp', sizes: '512x512', type: 'image/webp' }] });
    });
    a.addEventListener('pause', function () { caja.classList.remove('sonando'); txt.textContent = a.currentTime > 1 ? 'Seguir' : 'Escuchar'; btn.setAttribute('aria-label', 'Escuchar'); });
    a.addEventListener('timeupdate', function () {
      if (a.duration) barra.style.transform = 'scaleX(' + (a.currentTime / a.duration).toFixed(4) + ')';
      t.textContent = mmss(a.currentTime) + (a.duration ? ' / ' + mmss(a.duration) : '');
    });
    a.addEventListener('loadedmetadata', function () { t.textContent = '0:00 / ' + mmss(a.duration); });
    a.addEventListener('ended', function () { txt.textContent = 'Escuchar de nuevo'; });
    caja.querySelector('.audio-barra').addEventListener('click', function (e) {
      if (!a.duration) return; var r = this.getBoundingClientRect(); a.currentTime = (e.clientX - r.left) / r.width * a.duration;
    });
  }

  /* ---------- portada: el camino completo, en orden ---------- */
  function marcarAqui() {
    var s = pasoSiguiente(), r = document.getElementById('ruta');
    var sel = s.tipo === 'altar' ? '.ruta-altar' : s.tipo === 'etapa' ? '[data-etapa="' + s.e + '"]' : '[data-paso-lampara="' + s.n + '"]';
    var el = r && r.querySelector(sel); if (el) el.classList.add('aqui');
  }
  function portada() {
    var r = document.getElementById('ruta');
    if (!r) return;
    var h = '';
    E.forEach(function (e, i) {
      h += '<li class="ruta-etapa" data-etapa="' + i + '"><a href="etapa.html?e=' + (i + 1) + '">' +
        '<span class="re-num">' + e.id + '</span><span class="re-txt"><span class="re-tit">Etapa ' + e.id + ' · ' + esc(e.nombre) + '</span>' +
        '<span class="re-sub">Lámparas ' + e.desde + ' a ' + e.hasta + '</span></span></a></li>';
      for (var n = e.desde; n <= e.hasta; n++) {
        var l = L[n - 1];
        h += '<li class="ruta-lampara" data-paso-lampara="' + n + '"><a data-lampara="' + n + '" href="lampara.html?n=' + n + '">' +
          '<span class="rl-img"><img src="' + foto(n) + '"' + fallback(n) + ' alt="" width="96" height="96" loading="lazy"></span>' +
          '<span class="rl-txt"><span class="rl-num">' + n + ' · ' + esc(l.matiz) + '</span><span class="rl-tit">' + esc(l.titulo) + '</span></span>' +
          '<span class="rl-llama" aria-hidden="true"></span></a></li>';
      }
    });
    h += '<li class="ruta-altar"><a href="altar.html"><span class="re-num">&#10013;</span><span class="re-txt"><span class="re-tit">El altar</span><span class="re-sub">Cristo y la verdadera libertad</span></span></a></li>';
    r.innerHTML = h;
  }

  /* ---------- página de etapa ---------- */
  function paginaEtapa() {
    var main = document.getElementById('etapa');
    if (!main) return;
    var k = parseInt(new URLSearchParams(location.search).get('e'), 10);
    if (!(k >= 1 && k <= E.length)) k = 1;
    var e = E[k - 1], i = indicePaso('etapa', k - 1);
    document.title = 'Etapa ' + e.id + ' · ' + e.nombre + ' · La Catedral de la Libertad';
    var lista = '';
    for (var n = e.desde; n <= e.hasta; n++) lista += '<li data-lampara="' + n + '"><span>' + n + '</span>' + esc(L[n - 1].titulo) + '</li>';
    main.innerHTML =
      '<section class="etapa-hero">' +
        '<figure class="etapa-foto" data-foto3d="0.03"><img src="assets_img/foto-etapa-' + k + '.webp" alt="" onerror="this.parentNode.remove()"></figure>' +
        '<div class="etapa-txt"><p class="etapa-num" aria-hidden="true">' + e.id + '</p>' +
        '<h1>' + esc(e.nombre) + '</h1>' +
        '<p class="entradilla">' + esc(e.texto) + '</p></div>' +
      '</section>' +
      '<section class="etapa-lista" aria-labelledby="el-t"><h2 id="el-t">En esta etapa</h2><ol>' + lista + '</ol>' +
      '<a class="btn btn-oro btn-grande" href="lampara.html?n=' + e.desde + '">Empezar por la lámpara ' + e.desde + '</a></section>';
    reproductor(main.querySelector('.etapa-txt'), 'assets_audio/etapa-' + k + '.mp3', 'Etapa ' + e.id + ' · ' + e.nombre);
    barra(i);
  }

  /* ---------- página de lámpara ---------- */
  function paginaLampara() {
    var main = document.getElementById('lampara');
    if (!main) return;
    var n = parseInt(new URLSearchParams(location.search).get('n'), 10);
    if (!(n >= 1 && n <= N)) n = 1;
    var l = L[n - 1], e = E[etapaDe(n)], i = indicePaso('lampara', n);
    document.title = l.titulo + ' · La Catedral de la Libertad';
    var url = location.href.split('#')[0];
    var wa = 'https://wa.me/?text=' + encodeURIComponent('La Catedral de la Libertad · Lámpara ' + n + ': ' + l.titulo + '\n«' + l.llevar + '»\n' + url);
    var palabras = l.lectura.join(' ').split(/\s+/).length + l.detente.split(/\s+/).length + l.oracion.split(/\s+/).length;
    var min = Math.max(3, Math.round(palabras / 180));

    main.innerHTML =
      '<article class="lamp" data-lampara="' + n + '">' +
      '<figure class="lamp-foto" data-foto3d="0.03"><img src="' + foto(n) + '" alt="Fotografía de la lámpara ' + n + ': ' + esc(l.matiz) + '" onerror="this.closest(\'.lamp\').classList.add(\'sin-foto\');this.parentNode.remove()"><span class="lamp-velo" aria-hidden="true"></span></figure>' +
      '<header class="lamp-cab">' +
        '<div class="lamp-img"><img src="' + img(n) + '" width="304" height="304" alt=""><span class="lamp-luz" aria-hidden="true"></span></div>' +
        '<p class="lamp-datos">Etapa ' + e.id + ' · Lámpara ' + n + ' de ' + N + '</p>' +
        '<h1>' + esc(l.titulo) + '</h1>' +
        '<p class="lamp-fuente">Inspirada en <i>' + esc(l.obra) + '</i>, de ' + esc(l.autor) + ' · ' + min + ' min</p>' +
        '<div class="lamp-herr"><button type="button" class="btn btn-linea btn-peq" data-letra>Letra más grande</button>' +
        '<a class="btn btn-linea btn-peq" href="' + wa + '" target="_blank" rel="noopener">Enviar por WhatsApp</a></div>' +
      '</header>' +
      '<div class="lectura">' + l.lectura.map(function (p) { return '<p>' + esc(p) + '</p>'; }).join('') + '</div>' +
      '<section class="bloque detente"><h2>Detente un momento</h2><p>' + esc(l.detente) + '</p></section>' +
      '<section class="bloque palabra"><h2>Palabra de Dios</h2><blockquote><p>' + esc(l.palabra) + '</p><cite>' + esc(l.cita) + '</cite></blockquote></section>' +
      '<section class="bloque paso"><h2>Un paso para hoy</h2><p>' + esc(l.paso) + '</p></section>' +
      '<section class="bloque oracion"><h2>Oración</h2><p>' + esc(l.oracion) + '</p></section>' +
      '<section class="llevar"><h2>Para llevar contigo</h2><p class="llevar-frase">' + esc(l.llevar) + '</p>' +
        '<button type="button" class="btn btn-oro btn-grande btn-encender" data-encender>Encender esta lámpara</button>' +
        '<a class="btn btn-linea btn-grande llevar-sig" hidden></a>' +
        '<p class="llevar-nota" data-progreso aria-live="polite"></p></section>' +
      '</article>';

    reproductor(main.querySelector('.lamp-cab'), 'assets_audio/lampara-' + nn(n) + '.mp3', 'Lámpara ' + n + ' · ' + l.titulo, main.querySelector('.lamp-herr'));
    var sig = barra(i);
    var btn = main.querySelector('[data-encender]'), bSig = main.querySelector('.llevar-sig');
    bSig.href = sig.url;
    bSig.textContent = sig.tipo === 'altar' ? 'Llegar al altar ›' : sig.tipo === 'etapa' ? 'Seguir: Etapa ' + E[sig.e].id + ' ›' : 'Seguir: lámpara ' + sig.n + ' ›';
    function estado() {
      var on = encendida(n);
      btn.textContent = on ? 'Lámpara encendida' : 'Encender esta lámpara';
      btn.setAttribute('aria-pressed', on ? 'true' : 'false');
      main.querySelector('.lamp').classList.toggle('encendida', on);
      bSig.hidden = !on;
      bSig.classList.toggle('btn-oro', on); bSig.classList.toggle('btn-linea', !on);
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
  }

  /* ---------- altar ---------- */
  function altar() {
    var ol = document.getElementById('letania-lista');
    if (!ol) return;
    ol.innerHTML = L.map(function (l) {
      return '<li data-lampara="' + l.n + '"><span class="let-matiz">' + l.n + ' · ' + esc(l.matiz) + '</span><span class="let-frase">' + esc(l.llevar) + '</span></li>';
    }).join('');
    var ah = document.querySelector('.altar-hero');
    reproductor(ah, 'assets_audio/altar.mp3', 'El altar', ah && ah.querySelector('.cita-grande'));
    barra(PASOS.length - 1);
  }

  /* ---------- aparición al entrar en pantalla ---------- */
  function apariciones() {
    if (!('IntersectionObserver' in window) || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    var els = document.querySelectorAll('.camino-intro,.ruta li,.etapa-lista li,.lectura p,.bloque,.llevar > *,.letania li');
    var io = new IntersectionObserver(function (ents) {
      ents.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('visto'); io.unobserve(en.target); } });
    }, { rootMargin: '0px 0px -6% 0px' });
    els.forEach(function (el) { el.classList.add('aparece'); io.observe(el); });
  }

  var cab = document.querySelector('.cabecera');
  function cabScroll() { if (cab) cab.classList.toggle('compacta', window.scrollY > 30); }
  window.addEventListener('scroll', cabScroll, { passive: true });

  portada(); paginaEtapa(); paginaLampara(); altar(); pintarProgreso(); apariciones(); cabScroll();
})();
