import os
import shutil
from PIL import Image

# Source finalized high-resolution image
source_img = r"C:\Users\Wayne\.gemini\antigravity-ide\brain\5dfaeebf-d786-40ea-9c3d-2ead25e2086e\ccp_fms_final_flowchart_1788008039464.jpg"
output_png = r"c:\Users\Wayne\.gemini\antigravity-ide\scratch\ccp-fms\ccp_fms_flowchart.png"
output_jpg = r"c:\Users\Wayne\.gemini\antigravity-ide\scratch\ccp-fms\ccp_fms_flowchart.jpg"

if os.path.exists(source_img):
    img = Image.open(source_img)
    img.save(output_png, "PNG", quality=100)
    shutil.copyfile(source_img, output_jpg)
    print(f"SUCCESS: Finalized flowchart image saved to:\n -> {output_png}\n -> {output_jpg}")
else:
    print("Source image file not found.")
