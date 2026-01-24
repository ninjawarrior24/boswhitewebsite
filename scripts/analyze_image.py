import sys
from PIL import Image, ExifTags

path = sys.argv[1]
img = Image.open(path)
print(f"Path: {path}")
print(f"Format: {img.format}")
print(f"Size: {img.size}")
print(f"Mode: {img.mode}")
print(f"Info keys: {list(img.info.keys())}")

try:
    exif = img._getexif()
except Exception:
    exif = None
if exif:
    mapped = {ExifTags.TAGS.get(k,k): v for k,v in exif.items()}
    print("EXIF summary:")
    for tag in ("DateTime","Make","Model","Orientation"):
        if tag in mapped:
            print(f"  {tag}: {mapped[tag]}")
else:
    print("EXIF: None")

# Compute top colors and average
small = img.convert('RGB').resize((50,50))
colors = small.getcolors(50*50) or []
colors_sorted = sorted(colors, key=lambda x: x[0], reverse=True)
print("Top colors (count, rgb):")
for cnt, col in colors_sorted[:5]:
    print(f"  {cnt}, {col}")

pixels = list(small.getdata())
if pixels:
    avg = tuple(sum(c[i] for c in pixels)//len(pixels) for i in range(3))
    print(f"Average color (rgb): {avg}")
else:
    print("Average color: none")
