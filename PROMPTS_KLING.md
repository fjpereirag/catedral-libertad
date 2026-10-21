# Fotos para «La Catedral de la Libertad» · prompts para Kling

**Hay que generar 20 imágenes.** Guarda cada una con el **nombre exacto** indicado y pásala por `preparar_fotos.py`, o súbela a `assets_img/` en formato .webp. Una foto que falte no rompe nada: la web sigue usando el dibujo o la ilustración.

**Ajustes en Kling:** texto a imagen, calidad 2K, 1 resultado por prompt. Usa el formato indicado en cada caso. Si Kling permite referencia de estilo, usa `foto-nave` como referencia para las demás y así todas tendrán la misma luz.

**Estilo común:** añade esta línea al final de cada prompt.

> `photorealistic, cinematic 35mm photograph, warm golden candlelight, deep black shadows, gold and ivory palette, soft film grain, quiet contemplative mood, no text, no watermark`

Las personas aparecen de espaldas, en silueta o con el rostro en sombra: así no parecen retratos de alguien concreto y cualquiera puede verse en la escena.

## Portada, etapas y altar

| Archivo | Formato | Prompt |
|---|---|---|
| `foto-nave` | 16:9 | Interior of a vast gothic cathedral seen from the entrance, long central nave with ribbed vaults and tall pillars, fifteen small oil sanctuary lamps hanging along the nave glowing softly, at the far end a luminous altar with a simple cross in golden light, dust in light beams, empty pews, symmetrical one-point perspective |
| `foto-etapa-1` | 4:5 | A person seen from behind standing at the open wooden door of a dark cathedral, warm light spilling out from inside onto the stone threshold, first step into the light, dawn |
| `foto-etapa-2` | 4:5 | Two hands, one old and one young, together lighting a votive candle in a dim side chapel of a cathedral, warm close-up, stone wall bokeh |
| `foto-etapa-3` | 4:5 | A lone pilgrim with a walking staff walking down a long cathedral aisle toward distant golden light, many oil lamps along the way, perseverance, low angle |
| `foto-altar` | 16:9 | Simple stone altar in the apse of a gothic cathedral, plain wooden cross above it bathed in a shaft of golden light from a high window, white altar cloth, many small oil lamps burning around, reverent, majestic, centered composition |

## Las quince lámparas (16:9, sujeto en el centro: también se recorta en círculo)

| Archivo | Lámpara | Prompt |
|---|---|---|
| `foto-lampara-01` | Elegir | A person seen from behind standing where a country path splits in two at sunrise, golden light over green hills, moment of decision |
| `foto-lampara-02` | Hacer el bien | An open hand under falling rain holding a small glowing flame of light, dark storm clouds, rain drops lit in gold |
| `foto-lampara-03` | Responder | A small stone chapel with its door lit from within, standing firm in a storm at dusk, rain, a winding path leading to it |
| `foto-lampara-04` | Volver | An embrace in an open doorway: a returning traveler held by someone at home, warm light from inside the house, faces hidden in the embrace |
| `foto-lampara-05` | Fragilidad | An old cracked clay jar on a wooden table with golden light shining through its cracks, dark background, kintsugi feeling |
| `foto-lampara-06` | Pequeños síes | Stepping stones crossing a calm river, a foot stepping onto the first stone, morning mist, golden light |
| `foto-lampara-07` | Amar | One hand gently offering a small wrapped gift to another open hand, nothing asked in return, warm window light, close-up |
| `foto-lampara-08` | Discernir | A person walking carefully on a rope bridge over a misty mountain valley, a second figure walking beside them, vertigo and trust, soft light |
| `foto-lampara-09` | Recomenzar | A person on one knee on a stone floor pushing up to stand again, a shaft of light falling on them from above, dust in the beam |
| `foto-lampara-10` | Humildad | A man kneeling in prayer in an empty church, head bowed, hands together, single beam of soft light, seen from the side in shadow |
| `foto-lampara-11` | Fidelidad | A ship's iron anchor holding firm on a rocky shore while waves crash around it, stormy sea, golden break in the clouds |
| `foto-lampara-12` | Sanar | An old tree with a scarred hollow trunk, a small candle flame burning safely inside the hollow, quiet forest at dusk |
| `foto-lampara-13` | Lo pequeño | Cupped hands holding a tiny green seedling in dark soil, soft light from above, simple and humble |
| `foto-lampara-14` | Silencio | Night sky full of stars over a silent monastery on a hill, a single lit window, deep calm |
| `foto-lampara-15` | Permanecer | Glowing embers and a small steady fire still burning in a stone hearth in a dark room, night, faithful warmth |

## Para subirlas

**Opción A (yo las coloco):** sube los archivos a una carpeta de Google Drive y dime cómo se llama. Los descargo, los convierto y te devuelvo la web actualizada.

**Opción B (tú mismo):** pon las imágenes en una carpeta `fotos_kling/` junto a la web y ejecuta:

```
py preparar_fotos.py fotos_kling
```

El script crea los .webp optimizados en `assets_img/`.
