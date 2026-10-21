# La Catedral de la Libertad

Guía web de quince lámparas para descubrir con Cristo para qué queremos ser libres. Misma familia visual que *Huellas franciscanas · Tierra Santa 3D* (fondo negro, oro, Cormorant Garamond + Inter).

## Archivos (estructura plana, como `tierra-santa-web`)

| Archivo | Qué es |
|---|---|
| `index.html` | Portada: nave en perspectiva, el camino, las tres etapas, rosetón de los quince matices, infografía y cierre |
| `lampara.html?n=1…15` | Lectura de cada lámpara: texto, Detente, Palabra de Dios, Un paso para hoy, Oración, Para llevar contigo |
| `altar.html` | Final del camino y las quince frases «para llevar contigo» |
| `contenido.js` | Todo el texto (`window.CL`): editar aquí para corregir una lámpara |
| `app.js` | Páginas, progreso, mapa, apariciones |
| `nave.js` | Portada: foto de la nave + 15 lámparas colgando en 3D + polvo de luz (canvas 2D) |
| `vuelo.js` | «Recorre la nave»: pasillo 3D (CSS 3D) con las 15 lámparas hasta el altar |
| `efectos.js` | Fotos 3D por profundidad, polvo de luz, chispas al encender, títulos animados, inclinación 3D |
| `estilo.css` | Estilo |
| `assets_img/` | Infografía, 15 ilustraciones, 20 fotos (`foto-*.webp`) y sus 20 mapas de profundidad (`foto-*-prof.webp`) |

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
