import os
import shutil
from PIL import Image

brain_dir = r"C:\Users\Wayne\.gemini\antigravity-ide\brain\c14928eb-f687-4104-b980-b4497dce4495"
root_dir = r"c:\Users\Wayne\.gemini\antigravity-ide\scratch\ccp-fms"

# Updated Block Diagram Image (v2)
block_diagram_src = os.path.join(brain_dir, "ccp_fms_block_diagram_v2_1788293282569.jpg")
block_diagram_jpg = os.path.join(root_dir, "ccp_fms_block_diagram.jpg")
block_diagram_png = os.path.join(root_dir, "ccp_fms_block_diagram.png")

if os.path.exists(block_diagram_src):
    shutil.copyfile(block_diagram_src, block_diagram_jpg)
    img = Image.open(block_diagram_src)
    img.save(block_diagram_png, "PNG", quality=100)
    print("SUCCESS: Updated Block Diagram exported to:")
    print(f" -> {block_diagram_png}")
    print(f" -> {block_diagram_jpg}")
else:
    print("Source block diagram image not found.")
