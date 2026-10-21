"""Convierte las fotos generadas (jpg/png/webp) a .webp optimizados en assets_img/.
Uso:  py preparar_fotos.py fotos_kling
Los nombres deben empezar por: foto-nave, foto-altar, foto-etapa-1..3, foto-lampara-01..15
Requiere Pillow:  py -m pip install pillow
"""
import sys, re
from pathlib import Path
from PIL import Image

ANCHO = {"foto-nave": 2400, "foto-altar": 2000, "foto-etapa": 1400, "foto-lampara": 1800}

def main(origen):
    src = Path(origen)
    dst = Path(__file__).parent / "assets_img"
    dst.mkdir(exist_ok=True)
    hechos = 0
    for f in sorted(src.iterdir()):
        if f.suffix.lower() not in (".jpg", ".jpeg", ".png", ".webp"):
            continue
        if f.stem.lower().endswith("-prof"):
            print("  (profundidad: usa la celda de Colab)", f.name); continue
        m = re.match(r"(foto-nave|foto-altar|foto-etapa-[123]|foto-lampara-(\d{1,2}))", f.stem.lower())
        if not m:
            print("  (se ignora)", f.name); continue
        nombre = m.group(1)
        if m.group(2):
            nombre = "foto-lampara-%02d" % int(m.group(2))
        clave = re.sub(r"-\d+$", "", nombre)
        im = Image.open(f).convert("RGB")
        ancho = ANCHO.get(clave, 1800)
        if im.width > ancho:
            im = im.resize((ancho, round(im.height * ancho / im.width)), Image.LANCZOS)
        salida = dst / (nombre + ".webp")
        im.save(salida, "WEBP", quality=80, method=6)
        print("  ok", f.name, "->", salida.name, f"{salida.stat().st_size // 1024} KB")
        hechos += 1
    print(f"{hechos} fotos listas en assets_img/. Sube la carpeta a GitHub.")

if __name__ == "__main__":
    main(sys.argv[1] if len(sys.argv) > 1 else "fotos_kling")
