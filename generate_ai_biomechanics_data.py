import os
import json
import cv2
import numpy as np
from ultralytics import YOLO

EXERCISES_CONFIG = [
    {
        "id": "01",
        "name": "INCLINE DUMBBELL PRESS",
        "filename": "2026_10_06_18_03_56_IMG_7166.mp4",
        "trimStartSeconds": 4.0,
        "durationInFrames": 195,
    },
    {
        "id": "02",
        "name": "CHEST-SUPPORTED T-BAR ROW",
        "filename": "2026_10_06_18_18_14_IMG_7168.mp4",
        "trimStartSeconds": 12.5,
        "durationInFrames": 195,
    },
    {
        "id": "03",
        "name": "MACHINE CHEST FLY",
        "filename": "2026_10_06_18_31_18_IMG_7171.mp4",
        "trimStartSeconds": 24.0,
        "durationInFrames": 195,
    },
    {
        "id": "04",
        "name": "WIDE-GRIP LAT PULLDOWN",
        "filename": "2026_10_06_18_52_38_IMG_7202.MP4",
        "trimStartSeconds": 5.5,
        "durationInFrames": 195,
    },
    {
        "id": "05",
        "name": "STANDING MACHINE LATERAL RAISE",
        "filename": "2026_10_06_19_03_16_IMG_7207.MP4",
        "trimStartSeconds": 11.5,
        "durationInFrames": 195,
    },
    {
        "id": "06",
        "name": "BARBELL POWER RACK SHRUG",
        "filename": "2026_10_06_19_14_25_IMG_7213.MP4",
        "trimStartSeconds": 30.0,
        "durationInFrames": 195,
    },
    {
        "id": "07",
        "name": "CABLE STRAIGHT-ARM PULLDOWN",
        "filename": "2026_10_06_19_20_02_IMG_7214.MP4",
        "trimStartSeconds": 1.0,
        "durationInFrames": 195,
    },
    {
        "id": "08",
        "name": "KNEELING CABLE CRUNCH",
        "filename": "2026_10_06_19_26_57_IMG_7212.MP4",
        "trimStartSeconds": 1.5,
        "durationInFrames": 195,
    },
]

def main():
    print("🚀 Initializing AI Biomechanics Tracking & Occlusion Engine...")
    pose_model = YOLO("yolov8n-pose.pt")
    seg_model = YOLO("yolov8n-seg.pt")

    os.makedirs("public/tracking", exist_ok=True)
    results_database = {}

    for ex in EXERCISES_CONFIG:
        ex_id = ex["id"]
        filename = ex["filename"]
        trim_start = ex["trimStartSeconds"]
        duration = ex["durationInFrames"]
        filepath = os.path.join("public", filename)

        print(f"\n⚡ Processing [{ex_id}] {ex['name']} ({filename})...")
        if not os.path.exists(filepath):
            print(f"⚠️ Warning: File {filepath} not found, skipping.")
            continue

        cap = cv2.VideoCapture(filepath)
        video_fps = cap.get(cv2.CAP_PROP_FPS) or 30.0
        start_frame_idx = int(trim_start * video_fps)

        frames_data = []
        prev_lw_y = None
        prev_rw_y = None

        # Exponential Moving Average smoothing state
        smooth_lw = None
        smooth_rw = None

        # Process frames (sample every frame for full 195 frames)
        for f_idx in range(duration):
            target_frame = start_frame_idx + f_idx
            cap.set(cv2.CAP_PROP_POS_FRAMES, target_frame)
            ret, frame = cap.read()
            if not ret:
                break

            h, w = frame.shape[:2]

            # 1. Pose estimation (Wrists & Elbows)
            pose_res = pose_model(frame, verbose=False)[0]
            lw_x, lw_y, rw_x, rw_y = 0.40, 0.50, 0.60, 0.50 # fallback defaults
            conf_lw, conf_rw = 0.0, 0.0

            if pose_res.keypoints is not None and len(pose_res.keypoints.xyn) > 0:
                kpts = pose_res.keypoints.xyn[0].cpu().numpy()
                confs = pose_res.keypoints.conf[0].cpu().numpy() if pose_res.keypoints.conf is not None else [1.0]*17

                # COCO index: 9 = left_wrist, 10 = right_wrist
                if len(kpts) > 10:
                    lw_x, lw_y = float(kpts[9][0]), float(kpts[9][1])
                    rw_x, rw_y = float(kpts[10][0]), float(kpts[10][1])
                    conf_lw = float(confs[9]) if len(confs) > 9 else 0.8
                    conf_rw = float(confs[10]) if len(confs) > 10 else 0.8

            # Exponential Moving Average (EMA) to ensure butter-smooth rails without jitter
            alpha = 0.35
            if smooth_lw is None:
                smooth_lw = [lw_x, lw_y]
                smooth_rw = [rw_x, rw_y]
            else:
                smooth_lw = [alpha * lw_x + (1 - alpha) * smooth_lw[0], alpha * lw_y + (1 - alpha) * smooth_lw[1]]
                smooth_rw = [alpha * rw_x + (1 - alpha) * smooth_rw[0], alpha * rw_y + (1 - alpha) * smooth_rw[1]]

            # Velocity calculation (dY/dt)
            curr_avg_y = (smooth_lw[1] + smooth_rw[1]) / 2.0
            velocity = 0.0
            if prev_lw_y is not None:
                velocity = (prev_lw_y - curr_avg_y) * 100.0 # positive = moving UP, negative = moving DOWN
            prev_lw_y = curr_avg_y

            # Phase detection
            phase = "STATIONARY"
            if velocity > 0.4:
                phase = "CONCENTRIC_PUSH"
            elif velocity < -0.4:
                phase = "ECCENTRIC_STRETCH"
            elif abs(velocity) <= 0.4:
                phase = "PEAK_HOLD"

            # 2. Athlete Occlusion Polygon (extract for title window frames 0-80)
            occlusion_polygon = []
            if f_idx < 80 and f_idx % 2 == 0:
                seg_res = seg_model(frame, verbose=False)[0]
                if seg_res.masks is not None and len(seg_res.masks.xy) > 0:
                    # Select largest polygon (the athlete)
                    boxes = seg_res.boxes.data.cpu().numpy() if seg_res.boxes is not None else []
                    person_indices = [i for i, b in enumerate(boxes) if int(b[5]) == 0] if len(boxes) > 0 else [0]
                    if person_indices:
                        poly_raw = seg_res.masks.xy[person_indices[0]] # [N, 2] in pixels
                        # Simplify polygon to ~30-40 points for ultra-fast SVG clipPath rendering
                        epsilon = 0.008 * cv2.arcLength(poly_raw.astype(np.float32), True)
                        approx = cv2.approxPolyDP(poly_raw.astype(np.float32), epsilon, True)
                        # Normalize to 0-100%
                        for pt in approx:
                            occlusion_polygon.append([round(float(pt[0][0]) / w * 100.0, 1), round(float(pt[0][1]) / h * 100.0, 1)])

            frames_data.append({
                "frame": f_idx,
                "leftWrist": {"x": round(smooth_lw[0] * 100, 2), "y": round(smooth_lw[1] * 100, 2)},
                "rightWrist": {"x": round(smooth_rw[0] * 100, 2), "y": round(smooth_rw[1] * 100, 2)},
                "phase": phase,
                "velocity": round(velocity, 2),
                "occlusionPolygon": occlusion_polygon,
            })

        cap.release()
        results_database[ex_id] = {
            "exercise": ex["name"],
            "filename": filename,
            "totalFrames": len(frames_data),
            "tracking": frames_data,
        }
        print(f"✅ Processed {len(frames_data)} frames for [{ex_id}].")

    out_path = "public/tracking/ai_biomechanics_tracking.json"
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(results_database, f, indent=2)

    print(f"\n🎉 ALL 8 EXERCISES PROCESSED! Saved full database to: {out_path}")

if __name__ == "__main__":
    main()
