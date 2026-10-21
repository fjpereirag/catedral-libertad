/* La Catedral de la Libertad · «Recorre la nave»
   Al bajar, la cámara avanza por un pasillo 3D (CSS 3D, sin WebGL) y pasa junto a las 15 lámparas hasta el altar. */
(function () {
  'use strict';
  var D = window.CL, sec = document.getElementById('recorrido');
  if (!D || !sec) return;
  var pista = sec.querySelector('.vuelo-pista'), escena = sec.querySelector('.vuelo-escena'),
      mundo = sec.querySelector('.vuelo-mundo'), hud = sec.querySelector('.vuelo-hud'), barra = sec.querySelector('.vuelo-barra i');
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var L = D.lamparas, N = L.length;
  function nn(n) { return (n < 10 ? '0' : '') + n; }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function leidas() { try { return JSON.parse(localStorage.getItem('cl-encendidas') || '[]'); } catch (e) { return []; } }

  var items = L.map(function (l) {
    return { n: l.n, href: 'lampara.html?n=' + l.n, img: 'assets_img/foto-lampara-' + nn(l.n) + '.webp', alt: 'assets_img/lampara-' + nn(l.n) + '.webp',
      sup: 'Lámpara ' + l.n + ' · ' + l.matiz, tit: l.titulo, txt: l.llevar };
  });
  items.push({ n: 16, href: 'altar.html', img: 'assets_img/foto-altar.webp', alt: 'assets_img/infografia-movil.webp', sup: 'El altar', tit: D.altar.titulo, txt: D.altar.cita, altar: true });

  mundo.innerHTML = items.map(function (it, i) {
    return '<a class="vc' + (it.altar ? ' vc-altar' : '') + '" href="' + it.href + '" data-i="' + i + '"' + (it.altar ? '' : ' data-lampara="' + it.n + '"') + '>' +
      '<img src="' + it.img + '" alt="" loading="lazy" onerror="this.onerror=null;this.src=\'' + it.alt + '\'">' +
      '<span class="vc-txt"><span class="vc-sup">' + esc(it.sup) + '</span><span class="vc-tit">' + esc(it.tit) + '</span><span class="vc-frase">' + esc(it.txt) + '</span></span>' +
      '<span class="vc-llama" aria-hidden="true"></span></a>';
  }).join('');
  var cards = [].slice.call(mundo.children);

  if (reduce) { sec.classList.add('plano'); return; }

  var SP = 900, W = 0, movil = false, camZ = 0, objetivo = 0, ultimo = -1, activo = false;
  function medir() {
    W = innerWidth; movil = W < 760;
    SP = movil ? 760 : 900;
    pista.style.height = (N + 1) * (movil ? 48 : 58) + 100 + 'vh';
    cards.forEach(function (c, i) {
      var lado = i % 2 ? 1 : -1, x = c.classList.contains('vc-altar') ? 0 : lado * (movil ? W * 0.16 : Math.min(W * 0.24, 360));
      var ry = c.classList.contains('vc-altar') ? 0 : -lado * (movil ? 10 : 22);
      c._z = -(i + 1) * SP; c._x = x; c._ry = ry;
    });
    calc(); pintar();
  }
  function calc() {
    var r = pista.getBoundingClientRect(), total = pista.offsetHeight - innerHeight;
    var p = total > 0 ? Math.min(1, Math.max(0, -r.top / total)) : 0;
    objetivo = p * (N + 0.55) * SP;
    activo = r.top < innerHeight && r.bottom > 0;
    if (barra) barra.style.transform = 'scaleX(' + p.toFixed(4) + ')';
  }
  function pintar() {
    var lit = leidas(), cerca = 0, mejor = 1e9;
    cards.forEach(function (c, i) {
      var dz = c._z + camZ;                         // distancia a la cámara (negativo = delante)
      var vis = dz < 250 && dz > -SP * 6;
      c.style.visibility = vis ? 'visible' : 'hidden';
      if (!vis) return;
      var op = dz > 0 ? Math.max(0, 1 - dz / 250) : Math.min(1, 1 + (dz + SP * 2) / (SP * 4));
      c.style.opacity = op.toFixed(3);
      c.style.transform = 'translate(-50%,-50%) translate3d(' + c._x + 'px,0,' + dz.toFixed(1) + 'px) rotateY(' + c._ry + 'deg)';
      var d = Math.abs(dz + SP * 0.9);
      if (d < mejor) { mejor = d; cerca = i; }
      if (c.dataset.lampara) c.classList.toggle('encendida', lit.indexOf(+c.dataset.lampara) !== -1);
    });
    if (cerca !== ultimo && hud) {
      ultimo = cerca;
      var it = items[cerca];
      hud.textContent = it.altar ? 'Has llegado al altar' : 'Lámpara ' + it.n + ' de ' + N + ' · ' + it.tit;
    }
  }
  function loop() {
    requestAnimationFrame(loop);
    if (!activo) return;
    var d = objetivo - camZ;
    if (Math.abs(d) < 0.5) return;
    camZ += d * 0.12;
    pintar();
  }
  addEventListener('scroll', calc, { passive: true });
  addEventListener('resize', medir);
  addEventListener('cl:progreso', pintar);
  medir(); camZ = objetivo; pintar();
  requestAnimationFrame(loop);
})();
