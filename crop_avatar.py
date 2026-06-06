from PIL import Image

img = Image.open("avatar.png")
w, h = img.size
print(f"Size: {w}x{h}")

# Photo is 1444x2560, face is in top portion
# Crop a square region centered on the face
crop_y1 = 60
crop_size = w  # 1444
crop_y2 = crop_y1 + crop_size

cropped = img.crop((0, crop_y1, w, crop_y2))
cropped = cropped.resize((800, 800), Image.LANCZOS)
cropped.save("avatar.png")
print(f"Done: {cropped.size}")
