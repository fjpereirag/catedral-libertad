/* La Catedral de la Libertad · «Recorre la nave»
   Recorrido paso a paso por un pasillo 3D (CSS 3D, sin WebGL): flechas, teclado, deslizar o tocar un número.
   El scroll de la página queda libre: no se secuestra. */
(function () {
  'use strict';
  var D = window.CL, sec = document.getElementById('recorrido');
  if (!D || !sec) return;
  var escena = sec.querySelector('.vuelo-escena'), mundo = sec.querySelector('.vuelo-mundo'), rail = sec.querySelector('.vuelo-rail');
  var pSup = sec.querySelector('.vp-sup'), pTit = sec.querySelector('.vp-tit'), pFra = sec.querySelector('.vp-frase'), pLeer = sec.querySelector('.vp-leer');
  var bAnt = sec.querySelector('.vf-ant'), bSig = sec.querySelector('.vf-sig');
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var L = D.lamparas, N = L.length;
  function nn(n) { return (n < 10 ? '0' : '') + n; }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function leidas() { try { return JSON.parse(localStorage.getItem('cl-encendidas') || '[]'); } catch (e) { return []; } }

  var items = L.map(function (l) {
    return { n: l.n, href: 'lampara.html?n=' + l.n, img: 'assets_img/foto-lampara-' + nn(l.n) + '.webp', alt: 'assets_img/lampara-' + nn(l.n) + '.webp',
      sup: 'Lámpara ' + l.n + ' de ' + N + ' · ' + l.matiz, tit: l.titulo, txt: l.llevar, leer: 'Leer esta lámpara' };
  });
  items.push({ n: 0, href: 'altar.html', img: 'assets_img/foto-altar.webp', alt: 'assets_img/infografia-movil.webp', sup: 'Final del camino', tit: D.altar.titulo, txt: D.altar.cita, leer: 'Llegar al altar', altar: true });
  var T = items.length;

  mundo.innerHTML = items.map(function (it, i) {
    return '<div class="vc' + (it.altar ? ' vc-altar' : '') + '" data-i="' + i + '"' + (it.altar ? '' : ' data-lampara="' + it.n + '"') + '>' +
      '<img src="' + it.img + '" alt="" ' + (i < 3 ? '' : 'loading="lazy" ') + 'onerror="this.onerror=null;this.src=\'' + it.alt + '\'">' +
      '<span class="vc-num">' + (it.altar ? '✝' : it.n) + '</span><span class="vc-llama"></span></div>';
  }).join('');
  rail.innerHTML = items.map(function (it, i) {
    return '<li><button type="button" data-i="' + i + '"' + (it.altar ? '' : ' data-lampara="' + it.n + '"') + ' aria-label="' + esc(it.altar ? 'El altar' : 'Lámpara ' + it.n + ': ' + it.tit) + '">' + (it.altar ? '✝' : it.n) + '</button></li>';
  }).join('');
  var cards = [].slice.call(mundo.children), dots = [].slice.call(rail.querySelectorAll('button'));

  /* empieza en la primera lámpara sin encender (o la indicada en #recorrido-N) */
  var lit = leidas(), cur = 0;
  for (var k = 0; k < N; k++) if (lit.indexOf(k + 1) === -1) { cur = k; break; }
  if (lit.length === N) cur = N;
  var m = location.hash.match(/^#recorrido-(\d+)$/);
  if (m) cur = Math.max(0, Math.min(T - 1, +m[1] - 1));

  var SP = 1100, movil = false, cam = { x: 0, z: 0 }, tgt = { x: 0, z: 0 }, corriendo = false;
  function medir() {
    var W = innerWidth; movil = W < 760;
    SP = movil ? 900 : 1100;
    cards.forEach(function (c, i) {
      var lado = i % 2 ? 1 : -1;
      c._z = -i * SP;
      c._x = c.classList.contains('vc-altar') ? 0 : lado * (movil ? W * 0.55 : Math.min(W * 0.34, 520));
      c._ry = c.classList.contains('vc-altar') ? 0 : -lado * 28;
    });
    apuntar(); cam.x = tgt.x; cam.z = tgt.z; pintar();
  }
  function apuntar() { tgt.x = cards[cur]._x; tgt.z = -cards[cur]._z; }

  function pintar() {
    mundo.style.transform = 'translate3d(' + (-cam.x).toFixed(1) + 'px,0,' + (cam.z - 260).toFixed(1) + 'px)';
    var lit = leidas();
    cards.forEach(function (c, i) {
      var dz = c._z + cam.z;                       // 0 = la lámpara actual
      var vis = dz < SP * 0.6 && dz > -SP * 5.5;
      c.style.visibility = vis ? 'visible' : 'hidden';
      if (!vis) return;
      var cerca = Math.max(0, 1 - Math.abs(dz) / SP);          // 1 en la actual
      var op = dz > 0 ? Math.max(0, 1 - dz / (SP * 0.6)) : Math.max(0.15, 1 + dz / (SP * 6));
      c.style.opacity = op.toFixed(3);
      c.style.transform = 'translate(-50%,-50%) translate3d(' + c._x + 'px,0,' + c._z + 'px) rotateY(' + (c._ry * (1 - cerca)).toFixed(2) + 'deg)';
      c.classList.toggle('actual', i === cur);
      if (c.dataset.lampara) c.classList.toggle('encendida', lit.indexOf(+c.dataset.lampara) !== -1);
    });
  }

  function mostrar() {
    var it = items[cur], lit = leidas();
    pSup.textContent = it.sup + (it.altar ? '' : (lit.indexOf(it.n) !== -1 ? ' · encendida' : ''));
    pTit.textContent = it.tit; pFra.textContent = it.txt;
    pLeer.href = it.href; pLeer.textContent = it.leer;
    bAnt.disabled = cur === 0; bSig.disabled = cur === T - 1;
    dots.forEach(function (d, i) {
      d.classList.toggle('actual', i === cur);
      d.setAttribute('aria-current', i === cur ? 'step' : 'false');
      if (d.dataset.lampara) d.classList.toggle('encendida', lit.indexOf(+d.dataset.lampara) !== -1);
    });
    var cd = dots[cur]; if (cd && cd.scrollIntoView && rail.scrollWidth > rail.clientWidth) {
      rail.scrollTo({ left: cd.offsetLeft - rail.clientWidth / 2 + cd.offsetWidth / 2, behavior: reduce ? 'auto' : 'smooth' });
    }
  }

  var anim = null;
  function ir(i) {
    var antes = cur;
    cur = Math.max(0, Math.min(T - 1, i));
    apuntar(); mostrar();
    sec.classList.remove('panel-in'); void sec.offsetWidth; sec.classList.add('panel-in');
    if (reduce) { cam.x = tgt.x; cam.z = tgt.z; pintar(); return; }
    var saltos = Math.abs(cur - antes);
    anim = { t0: performance.now(), dur: 700 + Math.min(saltos, 8) * 90, x0: cam.x, z0: cam.z };
    if (!corriendo) { corriendo = true; requestAnimationFrame(paso); }
  }
  function suave(t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }
  function paso(now) {
    var t = Math.min(1, (now - anim.t0) / anim.dur), e = suave(t);
    cam.x = anim.x0 + (tgt.x - anim.x0) * e; cam.z = anim.z0 + (tgt.z - anim.z0) * e;
    pintar();
    if (t < 1) requestAnimationFrame(paso); else corriendo = false;
  }

  bAnt.addEventListener('click', function () { ir(cur - 1); });
  bSig.addEventListener('click', function () { ir(cur + 1); });
  rail.addEventListener('click', function (e) { var b = e.target.closest('button'); if (b) ir(+b.dataset.i); });
  mundo.addEventListener('click', function (e) {
    var c = e.target.closest('.vc'); if (!c) return;
    var i = +c.dataset.i;
    if (i === cur) location.href = items[i].href; else ir(i);
  });
  mundo.style.pointerEvents = 'auto';

  /* teclado: flechas cuando el recorrido está a la vista */
  var aLaVista = false;
  if ('IntersectionObserver' in window) new IntersectionObserver(function (es) { aLaVista = es[0].intersectionRatio > 0.5; }, { threshold: [0, 0.5, 1] }).observe(escena);
  document.addEventListener('keydown', function (e) {
    if (!aLaVista || e.target.closest('input,textarea,select')) return;
    if (e.key === 'ArrowRight') { e.preventDefault(); ir(cur + 1); }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); ir(cur - 1); }
    else if (e.key === 'Enter' && document.activeElement === escena) location.href = items[cur].href;
  });

  /* deslizar con el dedo (horizontal); el desplazamiento vertical sigue moviendo la página */
  var x0 = null, y0 = 0;
  escena.addEventListener('touchstart', function (e) { x0 = e.touches[0].clientX; y0 = e.touches[0].clientY; }, { passive: true });
  escena.addEventListener('touchend', function (e) {
    if (x0 === null) return;
    var dx = e.changedTouches[0].clientX - x0, dy = e.changedTouches[0].clientY - y0; x0 = null;
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy) * 1.3) ir(cur + (dx < 0 ? 1 : -1));
  }, { passive: true });

  addEventListener('resize', medir);
  addEventListener('cl:progreso', function () { pintar(); mostrar(); });
  medir(); mostrar();
})();
