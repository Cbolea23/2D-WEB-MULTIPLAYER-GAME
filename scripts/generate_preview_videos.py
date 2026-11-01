import os
import av
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter

out_dir = r"d:\desktop\2d roguelike web game\assets\cover"
os.makedirs(out_dir, exist_ok=True)

landscape_img_path = os.path.join(out_dir, "cover_landscape_1920x1080.png")
portrait_img_path = os.path.join(out_dir, "cover_portrait_800x1200.png")

img_land = Image.open(landscape_img_path).convert("RGB")
img_port = Image.open(portrait_img_path).convert("RGB")

def create_video(src_img, target_w, target_h, out_filename, title_text="CRYPT KEEPER: ROGUE SHOVEL", subtitle="UNEARTH THE CRYPT • 6-PLAYER CO-OP"):
    out_path = os.path.join(out_dir, out_filename)
    fps = 30
    duration_sec = 6
    total_frames = fps * duration_sec
    
    container = av.open(out_path, mode="w")
    stream = container.add_stream("libx264", rate=fps)
    stream.width = target_w
    stream.height = target_h
    stream.pix_fmt = "yuv420p"
    stream.options = {"crf": "20", "preset": "fast"}
    
    src_w, src_h = src_img.size
    
    # Random particles for soul wisps
    np.random.seed(42)
    num_particles = 40
    particles = []
    for _ in range(num_particles):
        particles.append({
            "x": np.random.uniform(0, target_w),
            "y": np.random.uniform(0, target_h),
            "speed": np.random.uniform(1.0, 3.0),
            "size": np.random.uniform(2, 5),
            "color": (np.random.randint(60, 100), np.random.randint(220, 255), np.random.randint(200, 255))
        })
        
    for frame_idx in range(total_frames):
        t = frame_idx / total_frames  # 0.0 to 1.0
        
        # Smooth Ken Burns zoom (1.0 to 1.15) and slight pan
        zoom = 1.0 + 0.12 * np.sin(t * np.pi * 0.5)
        crop_w = int(src_w / zoom)
        crop_h = int(src_h / zoom)
        
        pan_x = int((src_w - crop_w) * (0.3 + 0.4 * t))
        pan_y = int((src_h - crop_h) * (0.3 + 0.3 * np.sin(t * np.pi)))
        
        cropped = src_img.crop((pan_x, pan_y, pan_x + crop_w, pan_y + crop_h))
        frame_img = cropped.resize((target_w, target_h), Image.Resampling.BILINEAR)
        draw = ImageDraw.Draw(frame_img, "RGBA")
        
        # Vignette / subtle atmosphere pulse
        pulse = int(25 * (0.5 + 0.5 * np.sin(frame_idx * 0.15)))
        
        # Render magical soul particles
        for p in particles:
            p["y"] -= p["speed"]
            p["x"] += np.sin(frame_idx * 0.1 + p["speed"]) * 0.8
            if p["y"] < 0:
                p["y"] = target_h + 10
                p["x"] = np.random.uniform(0, target_w)
            
            px, py, psize = int(p["x"]), int(p["y"]), int(p["size"])
            glow_color = p["color"] + (180,)
            draw.ellipse([px - psize, py - psize, px + psize, py + psize], fill=glow_color)

        # Bottom banner with sleek typography
        banner_h = int(target_h * 0.18)
        draw.rectangle([0, target_h - banner_h, target_w, target_h], fill=(5, 8, 15, 210))
        draw.line([0, target_h - banner_h, target_w, target_h - banner_h], fill=(217, 119, 6, 255), width=2)
        
        # Text rendering (simple fallback fonts)
        font_size = int(target_h * 0.055)
        sub_size = int(target_h * 0.035)
        try:
            font = ImageFont.truetype("arial.ttf", font_size)
            sub_font = ImageFont.truetype("arial.ttf", sub_size)
        except Exception:
            font = ImageFont.load_default()
            sub_font = ImageFont.load_default()

        # Title text centered
        bbox = draw.textbbox((0, 0), title_text, font=font)
        tw = bbox[2] - bbox[0]
        tx = (target_w - tw) // 2
        ty = target_h - banner_h + int(banner_h * 0.18)
        
        # Gold shadow and glow
        draw.text((tx + 2, ty + 2), title_text, font=font, fill=(0, 0, 0, 220))
        draw.text((tx, ty), title_text, font=font, fill=(251, 191, 36, 255))
        
        # Subtitle
        s_bbox = draw.textbbox((0, 0), subtitle, font=sub_font)
        stw = s_bbox[2] - s_bbox[0]
        stx = (target_w - stw) // 2
        sty = ty + font_size + int(banner_h * 0.08)
        draw.text((stx + 1, sty + 1), subtitle, font=sub_font, fill=(0, 0, 0, 180))
        draw.text((stx, sty), subtitle, font=sub_font, fill=(103, 232, 249, 230))
        
        # Convert PIL Image to PyAV VideoFrame
        np_frame = np.array(frame_img.convert("RGB"))
        frame = av.VideoFrame.from_ndarray(np_frame, format="rgb24")
        for packet in stream.encode(frame):
            container.mux(packet)
            
    for packet in stream.encode():
        container.mux(packet)
        
    container.close()
    print(f"Generated {out_filename}: {target_w}x{target_h}, {os.path.getsize(out_path)} bytes")

create_video(img_land, 1280, 720, "preview_landscape.mp4", "CRYPT KEEPER: ROGUE SHOVEL", "ROGUELIKE DUNGEON CRAWLER • 6P CO-OP")
create_video(img_port, 720, 1080, "preview_portrait.mp4", "CRYPT KEEPER", "UNEARTH THE CRYPTS • PLAY NOW")
