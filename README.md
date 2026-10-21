# La Catedral de la Libertad

Guía web de quince lámparas para descubrir con Cristo para qué queremos ser libres. Misma familia visual que *Huellas franciscanas · Tierra Santa 3D* (fondo negro, oro, Cormorant Garamond + Inter).

## Archivos (estructura plana, como `tierra-santa-web`)

Versión **solo móvil** con **un único camino**: Portada → Etapa I → lámparas 1-5 → Etapa II → 6-10 → Etapa III → 11-15 → Altar. En ordenador se ve la misma columna de móvil, centrada.

| Archivo | Qué es |
|---|---|
| `index.html` | Portada (foto 3D de la nave) + el camino completo en orden, con «Sigue aquí» |
| `etapa.html?e=1…3` | Entrada de cada etapa |
| `lampara.html?n=1…15` | Lectura de cada lámpara |
| `altar.html` | Final del camino |
| `contenido.js` | Todo el texto (`window.CL`) |
| `app.js` | El camino, el progreso y la barra inferior ‹ Anterior · progreso · Siguiente › |
| `nave.js` | Portada: foto de la nave, lámparas en 3D y polvo de luz |
| `efectos.js` | Fotos 3D por profundidad, polvo de luz, chispas al encender, títulos animados |
| `estilo.css` | Estilo móvil |
| `assets_img/` | Fotos, mapas de profundidad, ilustraciones e infografía |

Las lámparas que cada persona enciende se guardan solo en su dispositivo (localStorage).

## Fotos realistas

La web ya está preparada para fotos: si en `assets_img/` existen `foto-nave.webp`, `foto-altar.webp`, `foto-etapa-1..3.webp` o `foto-lampara-01..15.webp`, se usan automáticamente. Si falta alguna, se ve el dibujo o la ilustración de siempre. Los prompts para Kling están en `PROMPTS_KLING.md` y la conversión en `preparar_fotos.py`.

## Fotos 3D (Colab)

En Drive, `Colab Notebooks/Catedral_fotos_3D.ipynb` crea en `preparar_fotos/profundidad/` un mapa de profundidad por foto (`foto-xx-prof.webp`). Copiados a `assets_img/`, cada foto se mueve en 3D. Si faltan, la foto se ve normal.

## Publicar en GitHub Pages

1. Crear repo público nuevo (p. ej. `catedral-libertad`).
2. «Add file → Upload files»: subir todos los archivos y la carpeta `assets_img` tal cual.
3. Settings → Pages → Branch `main` / root → Save.
4. Al cambiar CSS o JS, subir `?v=1` a `?v=2` en los tres HTML para saltar la caché.

## Probar en local

`py -m http.server 8000` dentro de la carpeta y abrir `http://localhost:8000`.
