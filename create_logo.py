import os
from PIL import Image, ImageDraw, ImageFont

logo_folder = os.path.join('static', 'logo')
logo_file = 'example_logo.png'
logo_path = os.path.join(logo_folder, logo_file)

if not os.path.exists(logo_folder):
    os.makedirs(logo_folder)
    print(f"Created logo folder: {logo_folder}")

if os.path.exists(logo_path):
    print(f"Logo file exists: {logo_path}")
else:
    print(f"Logo file does not exist: {logo_path}")
    print("Creating a placeholder logo...")
    img = Image.new('RGB', (200, 100), color='white')
    d = ImageDraw.Draw(img)
    d.text((10,40), "Placeholder Logo", fill=(0,0,0))
    img.save(logo_path)
    print(f"Placeholder logo created: {logo_path}")
